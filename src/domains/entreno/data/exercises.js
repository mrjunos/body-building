// Fotos de ejercicios: free-exercise-db (Unlicense), servidas desde public/fotos/.
// Animaciones: © Gym visual (https://gymvisual.com/), enlazadas —no copiadas—
// desde hasaneyldrm/exercises-dataset por jsDelivr. La atribución tiene que
// seguir visible en el pie de la app.
//
// Los tres JSON de al lado son la única fuente: mapping.json dice qué fotos
// lleva cada ejercicio, gifs.json qué animación, y names.json cómo se llaman en
// español. fetch.sh se apoya en mapping.json para descargar las fotos.
import mapping from './mapping.json';
import gifs from './gifs.json';
import names from './names.json';

const IMGBASE = '/fotos/';
const GIFBASE = 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/videos/';

export const NAMES = names;

/** { clave: { p: idPrincipal, a: [idsAlternativos] } } */
export const MAP = Object.fromEntries(
  Object.entries(mapping).map(([k, v]) => [k, { p: v.primary, a: v.alts || [] }])
);

/** { clave: nombreDeArchivoGif } */
export const GIFS = Object.fromEntries(Object.entries(gifs).map(([k, v]) => [k, v.file]));

export const shot = (id, i) => IMGBASE + id + '/' + i + '.jpg';
export const gifFor = (k) => (GIFS[k] ? GIFBASE + GIFS[k] : null);
