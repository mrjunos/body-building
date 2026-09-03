# -*- coding: utf-8 -*-
"""Vuelca gifs.json en la tabla GIFS de Entreno.dc.html.

gifs.json es el registro de qué animación corresponde a cada ejercicio;
esto evita que la tabla incrustada en el archivo de diseño se desincronice.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), 'Entreno.dc.html')

gifs = json.load(open(os.path.join(HERE, 'gifs.json'), encoding='utf-8'))
table = "{" + ",".join(f"{k}:'{v['file']}'" for k, v in sorted(gifs.items())) + "}"

html = open(SRC, encoding='utf-8').read()
html, n = re.subn(r'const GIFS = \{[^;]*\};', 'const GIFS = ' + table + ';', html, count=1)
if n != 1:
    sys.exit('No encuentro la tabla GIFS en Entreno.dc.html')
open(SRC, 'w', encoding='utf-8').write(html)
print(f'GIFS sincronizada: {len(gifs)} ejercicios')
