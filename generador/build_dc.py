# -*- coding: utf-8 -*-
"""Convierte Entreno.dc.html (el archivo del proyecto de Claude Design) en el
index.html que sirve GitHub Pages.

Dos cambios, nada más:
  1. React y ReactDOM se cargan desde vendor/ antes que support.js, así el
     runtime no va a buscarlos a unpkg (loadReactUmd se salta el CDN si
     window.React ya existe).
  2. Las fotos salen de fotos/ (560 px, en el repo) en vez de
     raw.githubusercontent.com, que sirve los originales de 850 px.
"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'Entreno.dc.html')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'index.html')

html = open(SRC, encoding='utf-8').read()

VENDOR = (
    '<script src="./vendor/react.production.min.js"></script>\n'
    '<script src="./vendor/react-dom.production.min.js"></script>\n'
    '<script src="./vendor/support.js"></script>'
)
html, n = re.subn(r'<script src="\./support\.js"></script>', VENDOR, html, count=1)
if n != 1:
    sys.exit('No encuentro la etiqueta <script src="./support.js"> en Entreno.dc.html')

html, n = re.subn(
    r"const IMGBASE = '[^']*';",
    "const IMGBASE = './fotos/';",
    html, count=1)
if n != 1:
    sys.exit('No encuentro la constante IMGBASE en Entreno.dc.html')

open(OUT, 'w', encoding='utf-8').write(html)
print('Escrito', os.path.relpath(OUT, ROOT), '—', round(len(html.encode()) / 1024), 'KB')
