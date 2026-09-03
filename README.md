# Torso, Pierna y Running

App para llevar el entrenamiento desde el móvil, en el gimnasio.

**En vivo:** https://mrjunos.github.io/body-building/

Abre en el día que toca. Cada ejercicio lleva su objetivo de series, repeticiones
y RIR, y registras el peso y las reps de cada serie con botones grandes de + y −.
Guarda el historial, te enseña lo que levantaste la última vez y te marca el PR.
Detrás del botón `i` de cada ejercicio están las fotos de inicio y final, la nota
de técnica y las alternativas por si la máquina está ocupada.

También hay vista de semana, notas de sesión, tema claro/oscuro y un botón para
mantener la pantalla encendida mientras entrenas.

Todo se guarda en el navegador del móvil (`localStorage`); no hay servidor ni cuenta.

## Contenido

| Ruta | Qué es |
| --- | --- |
| `index.html` | La app que sirve GitHub Pages. Generada, no la edites a mano. |
| `Entreno.dc.html` | **La fuente.** Diseño y lógica, editable en Claude Design. |
| `fotos/` | Las 76 fotos de ejercicios a 560 px. |
| `vendor/` | React, ReactDOM y el runtime `support.js`, servidos desde el repo. |
| `generador/build_dc.py` | Convierte `Entreno.dc.html` en `index.html`. |
| `generador/routine.py` | Datos de la rutina: días, ejercicios, series, reps, RIR y notas. |
| `generador/mapping.json` | Qué foto le toca a cada movimiento (`primary` + `alts`). |
| `generador/names.json` | Nombres en español de los ejercicios de la base. |
| `generador/fetch.sh` | Descarga el dataset y las fotos (macOS: usa `sips`). |
| `generador/build.py` | Genera `antigua.html`, la primera versión de una sola página. |
| `propuesta semanal.md` | El plan: 4 días de fuerza torso/pierna + 3 de running. |
| `ejercicios por mulculo.txt` | Selección de ejercicios y notas de técnica por grupo muscular. |

## Regenerar la app

```sh
python3 generador/build_dc.py    # Entreno.dc.html -> index.html
```

`build_dc.py` sólo hace dos cambios sobre el archivo de diseño: carga React desde
`vendor/` en vez de unpkg, y apunta las fotos a `fotos/` en vez de a
`raw.githubusercontent.com`. Así la app no depende de ningún tercero en runtime.

Para cambiar la rutina, edita `Entreno.dc.html` (en Claude Design o a mano) y
vuelve a ejecutarlo. `generador/routine.py` mantiene los mismos datos y es lo que
alimenta al proyecto de diseño.

### Rehacer las fotos

```sh
bash generador/fetch.sh          # descarga el dataset y las redimensiona
```

Luego copia `generador/small/<Id>__<n>.jpg` a `fotos/<Id>/<n>.jpg`.

## Créditos

Selección de ejercicios según Neco (doctor en Ciencias del Deporte) y Andoni,
en *El mejor ejercicio para cada músculo*.

Fotografías de [free-exercise-db](https://github.com/yuhonas/free-exercise-db),
publicado bajo licencia Unlicense (dominio público).

React 18.3.1 (MIT), servido desde `vendor/`; los hashes SRI coinciden con los
que espera `support.js`.
