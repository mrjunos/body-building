/**
 * El historial de antes de Firebase: vivía en localStorage con esta clave, y
 * en el origen de GitHub Pages. Ver legacyHandoff.js y migrateLegacyLog.js.
 */
export const LEGACY_KEY = 'entreno-log-v1';
export const MIGRATED_PREFIX = 'entreno-migrated-v1:';

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function readLegacyLog(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(LEGACY_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/** Un día sin notas ni ninguna serie tocada no aporta nada que migrar. */
export function isEmptyDay(day) {
  if (!day || typeof day !== 'object') return true;
  if (typeof day.notes === 'string' && day.notes.trim()) return false;
  return Object.values(day.ex || {}).every((sets) => !Array.isArray(sets) || sets.every((s) => !s));
}

/**
 * Qué días del historial viejo hay que subir: los que tienen algo y cuyo doc
 * en Firestore está vacío o no existe. Un doc con datos puede venir de otro
 * dispositivo y ser más reciente, así que no se pisa.
 */
export function planMigration(legacy, existing) {
  return Object.keys(legacy)
    .filter((iso) => ISO_RE.test(iso))
    .filter((iso) => !isEmptyDay(legacy[iso]) && isEmptyDay(existing[iso]))
    .sort()
    .map((iso) => [iso, legacy[iso]]);
}
