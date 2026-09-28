# Torso, Pierna y Running

App para llevar el entrenamiento desde el móvil, en el gimnasio.

**En vivo:** https://entreno-jj.web.app

Abre en el día que toca. Cada ejercicio lleva su objetivo de series, repeticiones
y RIR, y registras el peso y las reps de cada serie con botones grandes de + y −.
Guarda el historial, te enseña lo que levantaste la última vez y te marca el PR.
Detrás del botón `i` de cada ejercicio están las fotos de inicio y final, la nota
de técnica y las alternativas por si la máquina está ocupada.

También hay vista de semana, notas de sesión, tema claro/oscuro y un botón para
mantener la pantalla encendida mientras entrenas.

Es una PWA instalable que funciona sin conexión: las fotos van en el precache y
las animaciones se cachean en la primera carga con red. Se entra con Google y el
historial vive en Firestore, así que sigue a la cuenta y no al móvil; sin red se
sigue registrando y las series se suben al reconectar.

## Stack

Vite + React 19, estilos en línea sobre variables CSS (Tailwind solo para layout),
`vite-plugin-pwa`, y Firebase (Auth, Firestore y Hosting) en el proyecto
`entreno-jj`. La misma forma que `mis-finanzas`.

## Desarrollo

```sh
cp .env.example .env     # y pobla los valores (firebase apps:sdkconfig WEB --project entreno-jj)
npm install
npm run dev
npm run lint
npm test                 # helpers, migración y recepción del historial
npm run test:rules       # firestore.rules contra el emulador (requiere Java)
```

Para probar sin tocar el proyecto real, levanta los emuladores y apunta la app a
ellos:

```sh
firebase emulators:start --only auth,firestore --project entreno-jj
VITE_USE_EMULATORS=true npm run dev
```

## Despliegue

Cada push a `main` despliega en Firebase Hosting con GitHub Actions
(`.github/workflows/deploy.yml`); cada PR publica un canal de preview. La config
web sale de las GitHub Variables `VITE_FIREBASE_*` y la cuenta de servicio del
secreto `FIREBASE_SERVICE_ACCOUNT_ENTRENO`. En los canales de preview el login
de Google no funciona, porque su dominio no está entre los autorizados de Auth.

Las reglas no las despliega CI; cuando cambies `firestore.rules`:

```sh
firebase deploy --only firestore:rules --project entreno-jj
```

## Datos

| Ruta en Firestore | Qué es |
| --- | --- |
| `users/{uid}/entrenoLog/{YYYY-MM-DD}` | Un doc por día: `dayKey`, `notes` y `ex` con las series de cada ejercicio. |
| `entreno_settings/users` | Lista blanca (`allowedEmails`). La crea el primer login del dueño. |

El tema claro/oscuro se queda en `localStorage`: es preferencia del dispositivo.

## La URL vieja

La app vivía en https://mrjunos.github.io/body-building/ y guardaba el historial en
el `localStorage` de ese origen. GitHub Pages sirve ahora la rama `gh-pages`, que
solo tiene `redirect/index.html`: empaqueta ese historial en el fragmento de la URL
y redirige aquí, donde `legacyHandoff.js` lo recoge y `migrateLegacyLog.js` lo sube
a Firestore al entrar, sin pisar días que ya tengan datos. Si cambias
`redirect/index.html`, publícalo en `gh-pages`.

## Contenido

| Ruta | Qué es |
| --- | --- |
| `src/domains/entreno/` | La app: datos de la rutina, contexto, hooks, helpers y componentes. |
| `src/domains/entreno/data/` | `days.js` (rutina), `mapping.json` (qué foto le toca a cada movimiento), `names.json` (nombres en español) y `gifs.json` (animación de cada ejercicio). |
| `src/auth/` | Login con Google y lista blanca. |
| `src/firebase.js` | Inicialización de Firebase, con caché persistente de Firestore. |
| `src/pwa.js` | Almacenamiento persistente y precalentado de las animaciones. |
| `public/fotos/` | Las 76 fotos de ejercicios a 560 px. |
| `firestore.rules` | Reglas, con sus tests en `tests/rules/`. |
| `redirect/index.html` | Lo que sirve GitHub Pages en la URL vieja. |
| `generador/fetch.sh` | Descarga el dataset y rehace las fotos (macOS: usa `sips`). |
| `docs/` | El plan: la propuesta semanal y la selección de ejercicios por músculo. |

### Rehacer las fotos

```sh
bash generador/fetch.sh
```

Luego copia `generador/small/<Id>__<n>.jpg` a `public/fotos/<Id>/<n>.jpg`.

## Créditos

Selección de ejercicios según Neco (doctor en Ciencias del Deporte) y Andoni,
en *El mejor ejercicio para cada músculo*.

Fotografías de [free-exercise-db](https://github.com/yuhonas/free-exercise-db),
publicado bajo licencia Unlicense (dominio público). Están en `public/fotos/`.

Las animaciones son **© [Gym visual](https://gymvisual.com/)** y **no se copian a
este repositorio**: se enlazan desde
[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
a través del CDN de jsDelivr, conservando la atribución exigida, que aparece en
el pie de la app. Su reutilización se rige por los
[términos de Gym visual](https://gymvisual.com/content/3-terms-and-conditions-of-use).
Los 22 ejercicios tienen animación, incluidos los tres días de running.
