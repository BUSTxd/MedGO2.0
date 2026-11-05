"""
Análisis local de las imágenes de un export, sin IA (OpenCV).

Por cada imagen:
  - logo: busca cada plantilla de data/logos/ (escudo + texto a su derecha) y, si
    está, guarda una copia SIN logo en <salida>/sin-logo/ (fondo liso → color del
    fondo; si no, inpaint). El original no se toca.
  - texto: fracción del contenido ocupada por líneas de texto y nº de líneas.
  - cuadro: líneas horizontales y verticales largas (rejilla de una tabla).
  - foto: pista numérica (píxeles planos, grano). La decisión final la toma
    quien mira la imagen: un dibujo escaneado sale con grano de foto.

Uso: py -3 -I scripts/imagenes/analizar.py <carpeta> <salida> [<carpeta de logos>]
Escribe <salida>/analisis.json.
"""
import sys, json, pathlib
import cv2
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')
carpeta, salida = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
dir_logos = pathlib.Path(sys.argv[3]) if len(sys.argv) > 3 else pathlib.Path(__file__).resolve().parents[2] / 'data' / 'logos'
(salida / 'sin-logo').mkdir(parents=True, exist_ok=True)
EXT = {'.png', '.jpg', '.jpeg', '.webp'}


def leer(p):
    img = cv2.imdecode(np.fromfile(str(p), np.uint8), cv2.IMREAD_UNCHANGED)
    if img is None:
        return None
    if img.ndim == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if img.shape[2] == 4:                                  # transparencia → sobre blanco
        a = img[:, :, 3:4].astype(np.float32) / 255
        img = (img[:, :, :3] * a + 255 * (1 - a)).astype(np.uint8)
    return img


def tinta(img):
    i = img.astype(np.int16)
    return (i.min(axis=2) < 225) | ((i.max(axis=2) - i.min(axis=2)) > 30)


# ─── logos ───────────────────────────────────────────────────────────────
def cargar_logo(p):
    logo = leer(p)
    ys, xs = np.where(tinta(logo))
    logo = logo[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cols = tinta(logo).any(axis=0)
    hueco = next((x for x in range(int(len(cols) * 0.1), len(cols)) if not cols[x:x + 20].any()), None)
    if hueco is None:                                      # logo sin texto aparte
        return {'nombre': p.stem, 'escudo': logo, 'texto': None}
    texto = logo[:, hueco:]
    ys, xs = np.where(tinta(texto))
    return {'nombre': p.stem, 'escudo': logo[:, :hueco], 'texto': texto[ys.min():ys.max() + 1, xs.min():xs.max() + 1]}


def mejor_match(img, t, alturas, zona=None):
    x0 = y0 = 0
    if zona:
        x0, y0, x1, y1 = [int(v) for v in zona]
        x0, y0 = max(0, x0), max(0, y0)
        img = img[y0:y1, x0:x1]
    H, W = img.shape[:2]
    mejor = (0.0, None)
    for th in alturas:
        th = int(th); tw = int(t.shape[1] * th / t.shape[0])
        if th < 10 or th >= H or tw >= W:
            continue
        r = cv2.matchTemplate(img, cv2.resize(t, (tw, th), interpolation=cv2.INTER_AREA), cv2.TM_CCOEFF_NORMED)
        _, v, _, (x, y) = cv2.minMaxLoc(r)
        if v > mejor[0]:
            mejor = (float(v), (x + x0, y + y0, tw, th))
    return mejor


def buscar_logo(img, logo):
    """Escudo (≥ 28 px de alto) y, si el logo tiene texto, el texto a su derecha.
    Calibrado el 2026-11-04 con 27 imágenes: logo real escudo 0,72 / texto 0,85;
    el resto, texto ≤ 0,41. Exigir los dos evita confundir una célula con el escudo."""
    ve, pe = mejor_match(img, logo['escudo'], np.geomspace(28, img.shape[0] * 0.6, 40))
    if pe is None or ve < 0.6:
        return None
    if logo['texto'] is None:
        return (pe, None) if ve >= 0.8 else None
    x, y, tw, th = pe
    vt, pt = mejor_match(img, logo['texto'], np.geomspace(th * 0.25, th * 0.8, 25),
                         (x + tw * 0.8, y - th * 0.2, x + tw * 9, y + th * 1.2))
    return (pe, pt) if vt >= 0.6 else None


def borrar_logo(img, logo, pe, pt):
    def silueta(t, w, h):
        return tinta(cv2.resize(t, (w, h), interpolation=cv2.INTER_AREA)).astype(np.uint8) * 255
    mask = np.zeros(img.shape[:2], np.uint8)
    x, y, w, h = pe
    m = silueta(logo['escudo'], w, h)
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(m, cs, -1, 255, thickness=cv2.FILLED)
    mask[y:y + h, x:x + w] |= m
    if pt:
        x, y, w, h = pt
        mask[y:y + h, x:x + w] |= silueta(logo['texto'], w, h)
    mask = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=3)
    anillo = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=4) & ~mask
    vec = img[anillo > 0]
    if vec.std(axis=0).max() < 8:
        out = img.copy(); out[mask > 0] = np.median(vec, axis=0)
        return out, 'relleno liso'
    return cv2.inpaint(img, mask, 6, cv2.INPAINT_TELEA), 'inpaint'


# ─── texto y cuadros ─────────────────────────────────────────────────────
def medir_texto(img):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    H, W = g.shape
    contenido = max(1, int(tinta(img).sum()))
    lineas_total, area_texto = 0, np.zeros((H, W), np.uint8)
    alturas = []
    for inv in (False, True):                              # texto oscuro sobre claro y claro sobre oscuro
        b = cv2.adaptiveThreshold(g, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
                                  cv2.THRESH_BINARY if inv else cv2.THRESH_BINARY_INV, 25, 15)
        n, _, st, _ = cv2.connectedComponentsWithStats(b, 8)
        letras = np.zeros_like(b)
        for i in range(1, n):
            x, y, w, h, a = st[i]
            if 6 <= h <= H / 12 and 1 <= w <= h * 2.5 and 0.12 < a / (w * h) < 0.95:
                letras[y:y + h, x:x + w] = 255
                alturas.append(h)
        if not alturas:
            continue
        hm = int(np.median(alturas))
        unido = cv2.morphologyEx(letras, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_RECT, (max(3, hm), max(1, hm // 3))))
        n2, _, st2, _ = cv2.connectedComponentsWithStats(unido, 8)
        for i in range(1, n2):
            x, y, w, h, a = st2[i]
            if w >= 3 * h and h <= hm * 2.2 and w >= 3 * hm:   # una línea de texto: ancha y baja
                lineas_total += 1
                area_texto[y:y + h, x:x + w] = 255
    # las cajas de línea incluyen el blanco entre letras: tope en 1
    # altura_letra: mediana de la altura de las letras en px (decide cuánto se puede achicar)
    return {'lineas': lineas_total, 'fraccion': round(min(1.0, float((area_texto > 0).sum()) / contenido), 3),
            'altura_letra': float(np.median(alturas)) if alturas else None}


def medir_cuadro(img):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    H, W = g.shape
    b = cv2.adaptiveThreshold(g, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 15, 8)
    hor = cv2.morphologyEx(b, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (max(10, W // 3), 1)))
    ver = cv2.morphologyEx(b, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (1, max(10, H // 4))))
    contar = lambda m: cv2.connectedComponentsWithStats(cv2.dilate(m, np.ones((3, 3), np.uint8)), 8)[0] - 1
    nh, nv = contar(hor), contar(ver)
    return {'horizontales': nh, 'verticales': nv, 'es_cuadro': nh >= 4 and nv >= 2}


def pista_foto(img):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.int16)
    d = np.maximum.reduce([np.abs(np.diff(g, axis=1))[:-1, :], np.abs(np.diff(g, axis=0))[:, :-1]])
    planos = float((d == 0).mean())
    suave = d < 12
    ruido = float(d[suave].mean()) if suave.any() else 0.0
    return {'planos': round(planos, 3), 'grano': round(ruido, 2), 'parece_foto': planos < 0.2 and ruido > 0.9}


# ─── principal ───────────────────────────────────────────────────────────
logos = [cargar_logo(p) for p in sorted(dir_logos.glob('*')) if p.suffix.lower() in EXT] if dir_logos.exists() else []
resultados = []
for p in sorted(x for x in carpeta.rglob('*') if x.suffix.lower() in EXT):
    img = leer(p)
    if img is None or min(img.shape[:2]) < 64:
        continue
    r = {'nombre': str(p.relative_to(carpeta)), 'ruta': str(p), 'W': img.shape[1], 'H': img.shape[0]}
    for logo in logos:
        hallado = buscar_logo(img, logo)
        if hallado:
            img, modo = borrar_logo(img, logo, *hallado)
            limpio = salida / 'sin-logo' / (p.stem + '.png')
            cv2.imencode('.png', img)[1].tofile(str(limpio))
            r['logo'] = {'cual': logo['nombre'], 'modo': modo, 'limpio': str(limpio)}
    t, c = medir_texto(img), medir_cuadro(img)
    r.update(texto=t, cuadro=c, foto=pista_foto(img))
    # «mucho texto»: lo mira Claude y decide si se rehace con código (tabla/diagrama de texto)
    r['mucho_texto'] = bool(c['es_cuadro'] or t['fraccion'] >= 0.35 or t['lineas'] >= 25)
    resultados.append(r)
    marcas = [k for k, v in (('LOGO', 'logo' in r), ('CUADRO', c['es_cuadro']), ('MUCHO TEXTO', r['mucho_texto']), ('foto?', r['foto']['parece_foto'])) if v]
    print(f"{t['fraccion']:.2f} texto · {t['lineas']:>3} líneas · rejilla {c['horizontales']}h/{c['verticales']}v  {r['nombre'][:42]:42} {' '.join(marcas)}")

(salida / 'analisis.json').write_text(json.dumps(resultados, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'\n{len(resultados)} imágenes · {sum("logo" in r for r in resultados)} con logo · '
      f'{sum(r["mucho_texto"] for r in resultados)} con mucho texto → {salida / "analisis.json"}')
