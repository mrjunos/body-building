import { GIFS, gifFor } from './domains/entreno/data/exercises.js';

const GIF_CACHE = 'entreno-gifs';

/**
 * Pide al navegador que no desaloje lo cacheado. Sin esto, el shell y las
 * fotos pueden desaparecer justo cuando hace falta: sin red en el gimnasio.
 */
async function persistStorage() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist();
    }
  } catch {
    /* el navegador puede negarlo, no es crítico */
  }
}

/**
 * Mete las animaciones en la caché en la primera carga con red, en vez de
 * esperar a que abras el panel de cada ejercicio. Son cross-origin, así que el
 * service worker no puede precacharlas en el build.
 */
async function warmGifCache() {
  if (!('caches' in window) || !navigator.onLine) return;
  try {
    const cache = await caches.open(GIF_CACHE);
    const urls = [...new Set(Object.keys(GIFS).map(gifFor).filter(Boolean))];
    const pending = [];
    for (const url of urls) {
      if (!(await cache.match(url))) pending.push(url);
    }
    // De una en una y en segundo plano: esto compite con la carga de la app.
    for (const url of pending) {
      try {
        const res = await fetch(url, { mode: 'cors', cache: 'no-cache' });
        if (res.ok) await cache.put(url, res.clone());
      } catch {
        /* se reintenta en la siguiente carga */
      }
    }
  } catch {
    /* sin Cache API o cuota llena */
  }
}

export function initPwa() {
  persistStorage();
  // Esperar a que la app haya pintado antes de tirar de red por 1,9 MB de GIFs.
  if (document.readyState === 'complete') setTimeout(warmGifCache, 2000);
  else window.addEventListener('load', () => setTimeout(warmGifCache, 2000));
}
