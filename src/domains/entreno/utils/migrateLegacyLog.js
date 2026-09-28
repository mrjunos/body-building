import { collection, doc, getDocsFromServer, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase.js';
import { MIGRATED_PREFIX, planMigration, readLegacyLog } from './legacyLog.js';

const CHUNK = 400;
const inflight = new Map();

/**
 * Sube a Firestore el historial de localStorage, una sola vez por cuenta.
 * Idempotente: no pisa días que ya tengan datos, marca la bandera solo tras
 * confirmar los commits (un fallo reintenta en la próxima carga) y nunca borra
 * la clave vieja, que queda como seguro para volver atrás.
 */
export function migrateLegacyLog(uid, storage = window.localStorage) {
  if (!inflight.has(uid)) {
    inflight.set(uid, run(uid, storage).finally(() => inflight.delete(uid)));
  }
  return inflight.get(uid);
}

async function run(uid, storage) {
  const flag = MIGRATED_PREFIX + uid;
  if (storage.getItem(flag)) return 0;

  const legacy = readLegacyLog(storage);
  let count = 0;
  if (Object.keys(legacy).length) {
    const col = collection(db, 'users', uid, 'entrenoLog');
    // Del servidor, no de la caché: decidir con una caché vieja podría pisar
    // días registrados en otro dispositivo. Sin red lanza y se reintenta.
    const snap = await getDocsFromServer(col);
    const existing = Object.fromEntries(snap.docs.map((d) => [d.id, d.data()]));
    const writes = planMigration(legacy, existing);
    for (let i = 0; i < writes.length; i += CHUNK) {
      const batch = writeBatch(db);
      for (const [iso, day] of writes.slice(i, i + CHUNK)) {
        batch.set(doc(col, iso), { ...day, updatedAt: serverTimestamp() }, { merge: true });
      }
      await batch.commit();
    }
    count = writes.length;
  }
  storage.setItem(flag, new Date().toISOString());
  return count;
}
