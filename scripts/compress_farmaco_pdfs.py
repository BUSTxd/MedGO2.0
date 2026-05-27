"""
Recomprime los PDFs de Farmacología sin perder nitidez de imágenes.

Estrategia:
  - Recorre cada PDF en SOURCE_DIR.
  - Para cada imagen >150 DPI re-renderiza a 150 DPI y la re-encodea como JPEG q85.
  - Si la imagen ya está por debajo de 150 DPI o pesa menos como deflate, la deja.
  - Guarda con garbage=4, deflate=True, clean=True para purgar objetos huérfanos.
  - Si el output pesa más que el original, conserva el original (algunos ya están óptimos).

Uso:
    py -m pip install pymupdf pillow
    py scripts/compress_farmaco_pdfs.py
"""
import io
import os
import sys
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

SOURCE_DIR = Path(r"C:\Users\BUST\Downloads")
OUT_DIR    = Path(r"C:\Users\BUST\Downloads\farmaco-compressed")

TARGET_DPI = 150
JPEG_QUALITY = 85

# (archivo_origen, slug_destino)
FILES = [
    ("Receptores COLINÉRGICOS.pdf",                                              "colinergicos"),
    ("Receptores nicotínicos Ganglionares.pdf",                                  "nicotinicos_ganglio"),
    ("Receptor nicotínico muscular.pdf",                                         "nicotinico_muscular"),
    ("Receptores de HISTAMINA.pdf",                                              "histamina"),
    ("Biológicos y biosimilares.pdf",                                            "biologicos"),
    ("TERAPIA GÉNICA.pdf",                                                       "terapia_genica"),
    ("Antibiticos B-lactmicos_(Penicilina_Cefalosporinas_Carbapenems).pdf",      "b_lactamicos"),
    ("Fluroquinolonas, aminoglucósidos, macrólidos.pdf",                         "fluroquinolonas"),
    ("Clindamicina · Vancomicina · Trimetoprim-sulfametoxazol.pdf",              "clindamicina"),
]


def estimated_dpi(image_w_px: int, image_h_px: int, bbox_w_pt: float, bbox_h_pt: float) -> float:
    """Estima el DPI promedio de una imagen colocada en una página."""
    if bbox_w_pt <= 0 or bbox_h_pt <= 0:
        return 0
    dpi_w = image_w_px / (bbox_w_pt / 72.0)
    dpi_h = image_h_px / (bbox_h_pt / 72.0)
    return (dpi_w + dpi_h) / 2


def recompress_pdf(src_path: Path, dst_path: Path) -> tuple[int, int]:
    """Devuelve (bytes_original, bytes_final)."""
    original_size = src_path.stat().st_size
    doc = fitz.open(src_path)

    # Mapea xref -> (replacement_bytes, mime) para no procesar la misma imagen dos veces
    replacements: dict[int, tuple[bytes, str]] = {}

    for page in doc:
        # Lista de imágenes en la página: (xref, smask, w, h, bpc, cs, alt, name, filter)
        for img_info in page.get_images(full=True):
            xref = img_info[0]
            if xref in replacements:
                continue

            try:
                bbox_list = page.get_image_rects(xref)
            except Exception:
                bbox_list = []

            try:
                base = doc.extract_image(xref)
            except Exception:
                continue
            img_bytes = base["image"]
            img_ext = base["ext"]
            w_px = base.get("width", 0)
            h_px = base.get("height", 0)

            if not w_px or not h_px:
                continue

            # Estimar DPI usando el mayor bbox encontrado
            max_dpi = 0
            for r in bbox_list:
                dpi = estimated_dpi(w_px, h_px, r.width, r.height)
                if dpi > max_dpi:
                    max_dpi = dpi

            # Si no encontramos bbox, asumir que la imagen vale la pena recomprimir solo si está en JPEG2000 / lossless
            if max_dpi == 0:
                if img_ext.lower() in {"jpx", "jp2", "png", "tiff"}:
                    max_dpi = TARGET_DPI + 1  # forzar recompresión
                else:
                    continue

            if max_dpi <= TARGET_DPI * 1.05:
                # Ya está dentro del target, skip
                continue

            scale = TARGET_DPI / max_dpi
            new_w = max(1, int(w_px * scale))
            new_h = max(1, int(h_px * scale))

            try:
                pil = Image.open(io.BytesIO(img_bytes))
                if pil.mode in ("RGBA", "LA", "P"):
                    pil = pil.convert("RGB")
                pil = pil.resize((new_w, new_h), Image.LANCZOS)
                buf = io.BytesIO()
                pil.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
                new_bytes = buf.getvalue()
            except Exception as e:
                print(f"      ! No se pudo recomprimir xref {xref}: {e}")
                continue

            if len(new_bytes) < len(img_bytes):
                replacements[xref] = (new_bytes, "image/jpeg")

    # Aplicar reemplazos
    for xref, (new_bytes, _mime) in replacements.items():
        try:
            doc.update_stream(xref, new_bytes)
        except Exception as e:
            print(f"      ! Falló update_stream xref {xref}: {e}")

    # Guardar optimizado
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(
        dst_path,
        garbage=4,
        deflate=True,
        deflate_images=True,
        deflate_fonts=True,
        clean=True,
    )
    doc.close()

    final_size = dst_path.stat().st_size

    # Si el final pesa más que el original, copiar el original tal cual
    if final_size >= original_size:
        dst_path.write_bytes(src_path.read_bytes())
        final_size = dst_path.stat().st_size

    return original_size, final_size


def main() -> int:
    if not SOURCE_DIR.exists():
        print(f"No existe SOURCE_DIR: {SOURCE_DIR}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Comprimiendo {len(FILES)} PDFs a {OUT_DIR}\n")

    total_in = 0
    total_out = 0
    missing: list[str] = []

    for src_name, slug in FILES:
        src = SOURCE_DIR / src_name
        if not src.exists():
            missing.append(src_name)
            print(f"  ? FALTA: {src_name}")
            continue

        dst = OUT_DIR / f"{slug}_compressed.pdf"
        try:
            original, final = recompress_pdf(src, dst)
        except Exception as e:
            print(f"  x {src_name}: {e}")
            continue

        total_in += original
        total_out += final
        ratio = (1 - final / original) * 100 if original else 0
        print(f"  ok {slug:24s} {original/1024/1024:6.2f} MB -> {final/1024/1024:6.2f} MB  ({ratio:5.1f}% reduccion)")

    print(f"\nTotal: {total_in/1024/1024:.2f} MB -> {total_out/1024/1024:.2f} MB")
    if missing:
        print(f"\nFaltaron {len(missing)} archivos:")
        for m in missing:
            print(f"  - {m}")
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
