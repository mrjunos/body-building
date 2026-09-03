#!/usr/bin/env bash
# Descarga el dataset de ejercicios y las fotos que usa la rutina, y las
# comprime al tamaño con el que se incrustan en la web.
# Requiere macOS (usa `sips`). En Linux, sustituye el bucle por ImageMagick.
set -euo pipefail
cd "$(dirname "$0")"

REPO="https://raw.githubusercontent.com/yuhonas/free-exercise-db/main"

echo "→ Descargando exercises.json…"
curl -sfL -o exercises.json "$REPO/dist/exercises.json"

echo "→ Resolviendo las fotos de mapping.json…"
mkdir -p raw small
python3 - "$REPO" > .dl.sh <<'PY'
import json, sys
base = sys.argv[1] + "/exercises/"
db = {e['id']: e for e in json.load(open('exercises.json'))}
want = set()
for v in json.load(open('mapping.json')).values():
    want.update(db[v['primary']]['images'][:2])
    for a in v['alts']:
        if db[a]['images']:
            want.add(db[a]['images'][0])
for w in sorted(want):
    print(f'curl -sfL -o "raw/{w.replace("/", "__")}" "{base}{w}" &')
print("wait")
PY
bash .dl.sh && rm .dl.sh
echo "→ Comprimiendo $(ls raw | wc -l | tr -d ' ') fotos a 560 px…"
for f in raw/*; do
  sips -Z 560 -s format jpeg -s formatOptions 62 "$f" --out "small/$(basename "$f")" >/dev/null
done

echo "✓ Listo. Ahora: python3 generador/build.py"
