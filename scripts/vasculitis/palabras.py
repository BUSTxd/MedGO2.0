"""Tiempos por palabra de la narración de Vasculitis (para colocar los `at` de capitulos.ts).

    py -I scripts/vasculitis/palabras.py <carpeta de preparar-narracion>

Lee vasculitis-<cap>.wav y narracion.json; escribe palabras.json con, por capítulo y
paso, la lista [palabra, segundo desde el inicio del paso] y un palabras.txt legible.
"""
import json
import sys
from pathlib import Path

from faster_whisper import WhisperModel

carpeta = Path(sys.argv[1])
narr = json.loads((carpeta / 'narracion.json').read_text(encoding='utf8'))
modelo = WhisperModel('small', device='cpu', compute_type='int8')
salida, texto = [], []
for c in narr:
    segs, _ = modelo.transcribe(str(carpeta / f"vasculitis-{c['cap']}.wav"), language='es', word_timestamps=True, vad_filter=False, beam_size=5)
    palabras = [(w.word.strip(), w.start) for s in segs for w in s.words]
    marcas = c['marcas'] + [c['duracion'] + 1]
    pasos = []
    for i in range(len(c['marcas'])):
        a, b = marcas[i], marcas[i + 1]
        pasos.append([[p, round(t - a, 2)] for p, t in palabras if a - 0.3 <= t < b - 0.3])
    salida.append({'cap': c['cap'], 'pasos': pasos})
    for i, ps in enumerate(pasos):
        texto.append(f"\n== {c['cap']}.{i} ({round(marcas[i + 1] - marcas[i] - 1, 1)} s)")
        texto.append(' '.join(f'{p}@{t}' for p, t in ps))
    print('cap', c['cap'], 'listo', flush=True)
(carpeta / 'palabras.json').write_text(json.dumps(salida, ensure_ascii=False), encoding='utf8')
(carpeta / 'palabras.txt').write_text('\n'.join(texto), encoding='utf8')
