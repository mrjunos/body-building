import { useCallback, useEffect, useRef, useState } from 'react';

/** Mantiene la pantalla encendida mientras entrenas. */
export function useWakeLock() {
  const lock = useRef(null);
  const [awake, setAwake] = useState(false);

  const release = useCallback(() => {
    if (lock.current) {
      try {
        lock.current.release();
      } catch {
        /* ya liberado */
      }
      lock.current = null;
    }
  }, []);

  const toggleAwake = useCallback(async () => {
    if (lock.current) {
      release();
      setAwake(false);
      return;
    }
    try {
      if (navigator.wakeLock) {
        lock.current = await navigator.wakeLock.request('screen');
        lock.current.addEventListener?.('release', () => setAwake(false));
        setAwake(true);
      }
    } catch {
      /* el navegador lo niega, p. ej. sin interacción o batería baja */
    }
  }, [release]);

  useEffect(() => release, [release]);

  return { awake, toggleAwake };
}
