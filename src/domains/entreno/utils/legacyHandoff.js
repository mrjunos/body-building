import { LEGACY_KEY, MIGRATED_PREFIX, readLegacyLog } from './legacyLog.js';

/**
 * La app vieja guardaba el historial en el localStorage de mrjunos.github.io,
 * que esta app no puede leer por estar en otro origen. La página de Pages lo
 * mete en el fragmento de la URL al redirigir (#legacy=<base64url del JSON>);
 * el fragmento nunca sale del navegador. Aquí se recoge y se deja en el
 * localStorage de este origen, de donde lo sube migrateLegacyLog al entrar.
 */
export function decodeHandoff(hash) {
  const m = /(?:^#|&)legacy=([A-Za-z0-9_-]+)/.exec(hash || '');
  if (!m) return null;
  try {
    const b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const log = JSON.parse(new TextDecoder().decode(bytes));
    return log && typeof log === 'object' && !Array.isArray(log) ? log : null;
  } catch {
    return null;
  }
}

export function importLegacyHandoff(loc = window.location, storage = window.localStorage, hist = window.history) {
  if (!/(?:^#|&)legacy=/.test(loc.hash)) return false;
  const incoming = decodeHandoff(loc.hash);
  // El fragmento se quita siempre, se haya podido leer o no: no debe quedarse
  // en el historial ni en un acceso directo.
  hist.replaceState(null, '', loc.pathname + loc.search);
  if (!incoming) return false;
  try {
    // Lo que llega es la copia viva de la app vieja: manda sobre una importación anterior.
    storage.setItem(LEGACY_KEY, JSON.stringify({ ...readLegacyLog(storage), ...incoming }));
    // Datos nuevos: que la migración vuelva a correr para todas las cuentas.
    for (let i = storage.length - 1; i >= 0; i--) {
      const k = storage.key(i);
      if (k && k.startsWith(MIGRATED_PREFIX)) storage.removeItem(k);
    }
    return true;
  } catch {
    return false;
  }
}
