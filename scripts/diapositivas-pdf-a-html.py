"""
Diapositivas en PDF (un PowerPoint exportado) → resumen HTML en el envase
«páginas auto-escaladas» (.doc-paginas), listo para `upload-resumen-doc.mjs`.

    py scripts/diapositivas-pdf-a-html.py --pdf "<archivo>.pdf" --out <carpeta> \
       --parte h1=2-7 --parte h2=8-40 [--recortes imagenes_recortadas.html] \
       [--decorativas 93] [--nitidas p18_img01,p35_x203]

Deja una subcarpeta por parte (`<out>/h1/index.html` + `assets/*.avif`) que se
publica con:

    node scripts/upload-resumen-doc.mjs --dir <out>/h1 --curso <curso> --id <id> --slug <slug>

Por qué se reconstruye desde el PDF y no desde el export que llegue:
  · un `pdftohtml` trae el texto posicionado pero pide una capa
    `assets/layout/page_NNN.webp` por diapositiva que no viene, y rompe los
    símbolos de Wingdings (las flechas salen como caracteres privados);
  · los «recortes» de las figuras que se hacen desde la diapositiva son
    CAPTURAS de esa zona: llevan quemadas las etiquetas y flechas que la
    diapositiva dibuja encima. Puestos en la página junto al texto real, todo
    sale duplicado. Aquí cada imagen se extrae limpia del propio PDF (con su
    máscara, su volteo y la proporción con que la diapositiva la muestra) y se
    queda con el nombre del recorte equivalente si se pasa `--recortes`.

Qué produce cada diapositiva, en el ORDEN REAL DE DIBUJO del PDF (el `seqno`
de `get_bboxlog`, que es el mismo que traen dibujos y trazas de texto):
  · vectores —fondos, recuadros, resaltados, subrayados, flechas— → <svg>
    con el viewBox de la página, así escalan sin perder nitidez;
  · imágenes → `.figure` (se amplían en el visor) o `.deco` (no);
  · degradados e imágenes en línea (no son paths ni tienen xref) → se
    rasterizan de una copia de la página SIN TEXTO;
  · texto → un `.word` por tramo, posicionado por su línea base, con
    `--target-w` para que el visor lo estire o encoja al ancho del PDF
    (la fuente del sitio, Outfit, no mide lo mismo que Aptos).

Tres cosas que no se ven venir:
  · Las tabulaciones de PowerPoint son huecos DENTRO de una línea del PDF.
    Si la línea se ajusta entera a su ancho, el hueco se reparte entre las
    letras y «1.⇥Vasos» sale como «1. Vasos». Se parte en tramos.
  · La viñeta de Outfit es un punto diminuto: las «•» van en Arial, que es
    la que usa el PDF.
  · Las sombras de texto de PowerPoint llegan como PNG en gris del alto de
    una línea. No se publican (bajo otra fuente serían texto fantasma): el
    texto que tapan lleva `text-shadow`.
"""
import argparse, html, os, re
import fitz
from PIL import Image, ImageOps

ap = argparse.ArgumentParser()
ap.add_argument("--pdf", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--parte", action="append", required=True, help="clave=ini-fin (páginas del PDF, desde 1)")
ap.add_argument("--recortes", help="HTML con los recortes (pNN_imgMM · bbox PDF) para reutilizar sus nombres")
ap.add_argument("--decorativas", default="", help="xrefs de imágenes que no se amplían (emojis, iconos)")
ap.add_argument("--nitidas", default="", help="imágenes con texto o línea fina: AVIF sin submuestreo de croma")
args = ap.parse_args()

ASC = 0.87            # línea base de Outfit con line-height:1, en em
SIMBOLOS = {"": "→", "": "←", "\xa0": " "}   # Wingdings → Unicode
VINETAS = set("•▪■◦●")
DECORATIVAS = {int(x) for x in args.decorativas.split(",") if x}
NITIDAS = {x for x in args.nitidas.split(",") if x}

RECORTES = {}
if args.recortes:
    meta = open(args.recortes, encoding="utf-8").read()
    for m in re.finditer(r'(p(\d\d)_img\d\d)\.\w+ · \d+x\d+ · bbox PDF: ([\d.]+),([\d.]+),', meta):
        RECORTES[m.group(1)] = (int(m.group(2)), float(m.group(3)), float(m.group(4)))

fmt = lambda v, dec=3: f"{v:.{dec}f}".rstrip("0").rstrip(".")
hexc = lambda rgb: "#%02x%02x%02x" % tuple(round(c * 255) for c in rgb)


def svg_path(dr):
    d, cur = [], None
    igual = lambda a, b: a is not None and abs(a.x - b.x) < .01 and abs(a.y - b.y) < .01
    n = lambda v: fmt(v, 2)
    for it in dr["items"]:
        op = it[0]
        if op == "l":
            p1, p2 = it[1], it[2]
            if not igual(cur, p1): d.append(f"M{n(p1.x)} {n(p1.y)}")
            d.append(f"L{n(p2.x)} {n(p2.y)}"); cur = p2
        elif op == "c":
            p1, c1, c2, p2 = it[1:5]
            if not igual(cur, p1): d.append(f"M{n(p1.x)} {n(p1.y)}")
            d.append(f"C{n(c1.x)} {n(c1.y)} {n(c2.x)} {n(c2.y)} {n(p2.x)} {n(p2.y)}"); cur = p2
        elif op == "re":
            r = it[1]
            d.append(f"M{n(r.x0)} {n(r.y0)}H{n(r.x1)}V{n(r.y1)}H{n(r.x0)}Z"); cur = None
        elif op == "qu":
            q = it[1]
            d.append(f"M{n(q.ul.x)} {n(q.ul.y)}L{n(q.ur.x)} {n(q.ur.y)}L{n(q.lr.x)} {n(q.lr.y)}L{n(q.ll.x)} {n(q.ll.y)}Z"); cur = None
    if dr.get("closePath") and d and not d[-1].endswith("Z"): d.append("Z")
    a = [f'd="{"".join(d)}"']
    if dr.get("fill") is not None:
        a.append(f'fill="{hexc(dr["fill"])}"')
        if (dr.get("fill_opacity") or 1) < 1: a.append(f'fill-opacity="{n(dr["fill_opacity"])}"')
        if dr.get("even_odd"): a.append('fill-rule="evenodd"')
    else:
        a.append('fill="none"')
    if dr.get("color") is not None and "s" in dr["type"]:
        a.append(f'stroke="{hexc(dr["color"])}" stroke-width="{n(dr.get("width") or 1)}"')
        if (dr.get("stroke_opacity") or 1) < 1: a.append(f'stroke-opacity="{n(dr["stroke_opacity"])}"')
        cap = (dr.get("lineCap") or (0,))[0]
        if cap: a.append(f'stroke-linecap="{["butt", "round", "square"][cap]}"')
        join = int(dr.get("lineJoin") or 0)
        if join: a.append(f'stroke-linejoin="{["miter", "round", "bevel"][join]}"')
        m = re.match(r"\[([^\]]*)\]", dr.get("dashes") or "")
        if m and m.group(1).strip(): a.append(f'stroke-dasharray="{m.group(1).strip()}"')
    return f"<path {' '.join(a)}/>"


def guardar_avif(im, dest, nombre):
    nitida = nombre in NITIDAS
    if im.mode not in ("RGB", "RGBA"): im = im.convert("RGBA" if "A" in im.mode else "RGB")
    im.save(dest, quality=72 if nitida else 60, subsampling="4:4:4" if nitida else "4:2:0")


def extraer(doc, xref, smask, bbox, tr):
    """Imagen limpia, orientada y con la proporción de su caja en la diapositiva."""
    pix = fitz.Pixmap(doc, xref)
    if smask: pix = fitz.Pixmap(pix, fitz.Pixmap(doc, smask))
    if pix.colorspace and pix.colorspace.n == 4: pix = fitz.Pixmap(fitz.csRGB, pix)
    modo = "RGBA" if pix.alpha else ("L" if pix.n == 1 else "RGB")
    im = Image.frombytes(modo, (pix.width, pix.height), pix.samples)
    if tr[0] < 0: im = ImageOps.mirror(im)
    if tr[3] < 0: im = ImageOps.flip(im)
    if im.mode == "RGBA" and im.getchannel("A").getextrema()[0] == 255: im = im.convert("RGB")
    # La diapositiva puede estirar la imagen: se le da la proporción con que se
    # ve, para que el visor ampliado muestre lo mismo que la página.
    ar, (w, h) = bbox.width / bbox.height, im.size
    if abs(w / h - ar) > 0.01:
        im = im.resize((w, round(w / ar)) if w / h > ar else (round(h * ar), h), Image.LANCZOS)
    return im


def emitir(chars, capas, seq_de, sombras, W, H):
    """Un tramo de texto → un .word posicionado por su línea base."""
    chars = list(chars)
    while chars and not chars[0][0]["c"].strip(): chars.pop(0)
    while chars and not chars[-1][0]["c"].strip(): chars.pop()
    if not chars: return
    x0, x1 = chars[0][0]["bbox"][0], chars[-1][0]["bbox"][2]
    base = chars[0][0]["origin"][1]
    size = max(s["size"] for _, s in chars)
    seq = min(seq_de.get((round(c["origin"][0], 1), round(c["origin"][1], 1)), 10**6) for c, _ in chars)
    tramos = []
    for c, s in chars:
        ch = SIMBOLOS.get(c["c"], c["c"])
        est = (s["size"], s["color"], bool(s["flags"] & 16) or "Bold" in s["font"],
               bool(s["flags"] & 2) or "Italic" in s["font"], ch in VINETAS)
        if tramos and tramos[-1][0] == est: tramos[-1][1].append(ch)
        else: tramos.append((est, [ch]))
    inner = []
    for (sz, col, bold, ital, vineta), txt in tramos:
        st = []
        if abs(sz - size) > .1: st.append(f"font-size:{fmt(sz / size, 2)}em")
        if col: st.append(f"color:#{col:06x}")
        if bold: st.append("font-weight:700")
        if ital: st.append("font-style:italic")
        if vineta: st.append("font-family:Arial,Helvetica,sans-serif")
        t = html.escape("".join(txt))
        inner.append(f'<span style="{";".join(st)}">{t}</span>' if st else t)
    estilo = (f"left:{fmt(x0 / W * 100)}%;top:{fmt((base - ASC * size) / H * 100)}%;"
              f"font-size:{fmt(size / W * 100)}cqw;--target-w:{fmt((x1 - x0) / W * 100)}%")
    if any(fitz.Rect(x0, base - size, x1, base).intersects(sb) for sb in sombras):
        estilo += ";text-shadow:0.12em 0.12em 0.14em rgba(0,0,0,.28)"
    capas.append((seq, "txt", f'<div class="word" style="{estilo}">{"".join(inner)}</div>'))


def pagina(doc, sin_texto, n, assets, dir_assets):
    p = doc[n - 1]
    W, H = p.rect.width, p.rect.height
    log = p.get_bboxlog()
    capas = [(dr["seqno"], "vec", svg_path(dr)) for dr in p.get_drawings()]

    infos = p.get_image_info(xrefs=True)
    usados, sombras = set(), []
    for i, (t, r) in enumerate(log):
        if t not in ("fill-image", "fill-shade"): continue
        r = fitz.Rect(r)
        if t == "fill-shade":
            capas.append((i, "raster", r)); continue
        k = next((k for k, inf in enumerate(infos)
                  if k not in usados and fitz.Rect(inf["bbox"]).round() == r.round()), None)
        if k is None: continue
        usados.add(k)
        inf = infos[k]; x = inf["xref"]; b = fitz.Rect(inf["bbox"])
        if x == 0:
            capas.append((i, "raster", b)); continue
        info = doc.extract_image(x)
        if info["colorspace"] == 1 and b.height < 45:     # sombra de texto
            sombras.append(b); continue
        nombre = next((k for k, (pg, bx, by) in RECORTES.items()
                       if pg == n and abs(bx - b.x0) < 1 and abs(by - b.y0) < 1), f"p{n:02d}_x{x}")
        if x not in assets:
            guardar_avif(extraer(doc, x, info.get("smask"), b, inf["transform"]),
                         os.path.join(dir_assets, nombre + ".avif"), nombre)
            assets[x] = nombre
        capas.append((i, "img", dict(bbox=b, nombre=assets[x], deco=x in DECORATIVAS)))

    for idx, (sq, tipo, r) in enumerate(capas):
        if tipo != "raster": continue
        nombre = f"p{n:02d}_fondo{sq}"
        pix = sin_texto[n - 1].get_pixmap(clip=r, dpi=288)
        guardar_avif(Image.frombytes("RGB", (pix.width, pix.height), pix.samples),
                     os.path.join(dir_assets, nombre + ".avif"), nombre)
        assets[nombre] = nombre
        capas[idx] = (sq, "img", dict(bbox=r, nombre=nombre, deco=True))

    seq_de = {}
    for s in p.get_texttrace():
        for c in s["chars"]:
            seq_de.setdefault((round(c[2][0], 1), round(c[2][1], 1)), s["seqno"])

    for b in p.get_text("rawdict")["blocks"]:
        if b["type"]: continue
        for l in b["lines"]:
            chars, vistos = [], set()
            for s in l["spans"]:
                for c in s["chars"]:
                    key = (c["c"], round(c["origin"][0], 1), round(c["origin"][1], 1))
                    if key in vistos: continue       # relleno + contorno del mismo glifo
                    vistos.add(key); chars.append((c, s))
            if not chars: continue
            lsize = max(s["size"] for _, s in chars)
            segs, cur, prev = [], [], None
            for c, s in chars:
                bx0, bx1 = c["bbox"][0], c["bbox"][2]
                tab = not c["c"].strip() and (bx1 - bx0) > 0.45 * lsize
                salto = prev is not None and bx0 - prev > 0.45 * lsize
                if (tab or salto) and cur: segs.append(cur); cur = []
                if not tab: cur.append((c, s))
                prev = bx1
            if cur: segs.append(cur)
            for seg in segs: emitir(seg, capas, seq_de, sombras, W, H)

    capas.sort(key=lambda c: (c[0], {"vec": 0, "img": 1, "txt": 2}[c[1]]))
    partes, run = [], []
    def volcar():
        if run:
            partes.append(f'<svg class="vec" viewBox="0 0 {fmt(W)} {fmt(H)}" aria-hidden="true">{"".join(run)}</svg>')
            run.clear()
    for _, tipo, pay in capas:
        if tipo == "vec": run.append(pay); continue
        volcar()
        if tipo == "img":
            b = pay["bbox"]
            caja = (f"left:{fmt(b.x0 / W * 100)}%;top:{fmt(b.y0 / H * 100)}%;"
                    f"width:{fmt(b.width / W * 100)}%;height:{fmt(b.height / H * 100)}%")
            cls, alt = ("deco", "") if pay["deco"] else ("figure", f"Diapositiva {n}, figura")
            partes.append(f'<div class="{cls}" style="{caja}"><img src="assets/{pay["nombre"]}.avif" alt="{alt}"></div>')
        else:
            partes.append(pay)
    volcar()
    return (f'<section class="page-shell" data-slide="{n}"><div class="pdf-page" '
            f'style="aspect-ratio:{fmt(W)}/{fmt(H)}">{"".join(partes)}</div></section>')


CSS = """
.slides{display:flex;flex-direction:column;gap:22px;padding:4px 0 24px}
.page-shell{container-type:inline-size;width:100%;max-width:1280px;margin:0 auto;background:#fff;box-shadow:0 4px 18px rgba(10,12,30,.18);border-radius:4px;overflow:hidden}
.pdf-page{position:relative;width:100%;overflow:hidden;background:#fff;color:#000}
.pdf-page>*{position:absolute}
.vec{left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.figure,.deco{margin:0}
.figure img,.deco img{display:block;width:100%;height:100%;object-fit:fill}
.deco{pointer-events:none}
.word{white-space:pre;line-height:1;transform-origin:0 0;color:#000}
"""


def main():
    doc, sin = fitz.open(args.pdf), fitz.open(args.pdf)
    for p in sin:
        p.add_redact_annot(p.rect)
        p.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE,
                           graphics=fitz.PDF_REDACT_LINE_ART_NONE, text=fitz.PDF_REDACT_TEXT_REMOVE)
    for parte in args.parte:
        clave, rango = parte.split("=")
        ini, fin = (int(x) for x in rango.split("-"))
        d = os.path.join(args.out, clave); da = os.path.join(d, "assets")
        os.makedirs(da, exist_ok=True)
        assets = {}
        hojas = [pagina(doc, sin, n, assets, da) for n in range(ini, fin + 1)]
        html_doc = (f'<!doctype html><html lang="es"><head><meta charset="utf-8"><style>{CSS}</style></head>'
                    f'<body><div class="slides">{"".join(hojas)}</div></body></html>')
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(html_doc)
        print(f"{clave}: {len(hojas)} diapositivas · {len(set(assets.values()))} imágenes · {len(html_doc) // 1024} KB → {d}")


main()
