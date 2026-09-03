# Torso, Pierna y Running

Web para consultar la rutina del día desde el móvil, en el gimnasio.

**En vivo:** https://mrjunos.github.io/body-building/

Abre directamente en el día que toca. Cada ejercicio lleva foto, grupo muscular,
series y repeticiones con su RIR, y series que se marcan con el dedo. Al tocar
un ejercicio se despliega la posición de inicio y final, la nota de técnica y
las alternativas por si la máquina está ocupada.

Las 77 fotos van incrustadas en el HTML, así que la página funciona sin conexión
una vez cargada.

## Contenido

| Ruta | Qué es |
| --- | --- |
| `index.html` | La web, autocontenida. Ábrela en el navegador. |
| `propuesta semanal.md` | El plan: 4 días de fuerza torso/pierna + 3 de running. |
| `ejercicios por mulculo.txt` | Selección de ejercicios y notas de técnica por grupo muscular. |
| `generador/routine.py` | Los datos de la rutina: días, ejercicios, series, reps, RIR y notas. |
| `generador/mapping.json` | Qué foto de la base de ejercicios le toca a cada movimiento. |
| `generador/names.json` | Nombres en español de los ejercicios de la base. |
| `generador/build.py` | Genera `index.html`. |
| `generador/fetch.sh` | Descarga el dataset y las fotos (macOS: usa `sips`). |

## Regenerar la web

```sh
bash generador/fetch.sh      # solo la primera vez: descarga dataset y fotos
python3 generador/build.py   # escribe index.html
```

Para cambiar series, repeticiones, ejercicios o notas, edita `generador/routine.py`
y vuelve a ejecutar `build.py`. Para cambiar una foto, edita `generador/mapping.json`
(cada entrada tiene un `primary` y sus `alts`) y ejecuta `fetch.sh` de nuevo.

## Créditos

Selección de ejercicios según Neco (doctor en Ciencias del Deporte) y Andoni,
en *El mejor ejercicio para cada músculo*.

Fotografías de [free-exercise-db](https://github.com/yuhonas/free-exercise-db),
publicado bajo licencia Unlicense (dominio público).
