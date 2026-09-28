import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase.js';
import { useAuth } from '../../../auth/AuthContext.jsx';
import { DAYS, BY_KEY } from '../data/days.js';
import { applyComment, applySet, dateForKey, isoOf } from '../utils/entrenoHelpers.js';
import { migrateLegacyLog } from '../utils/migrateLegacyLog.js';
import { useTheme } from '../hooks/useTheme.js';
import { useWakeLock } from '../hooks/useWakeLock.js';

const EntrenoContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useEntreno() {
  const ctx = useContext(EntrenoContext);
  if (!ctx) throw new Error('useEntreno debe usarse dentro de <EntrenoProvider>');
  return ctx;
}

/**
 * Dueño de todo el estado de la app. Su API pública (log + acciones) es el
 * contrato que consumen los componentes y no cambió al pasar a Firestore.
 *
 * El historial vive en users/{uid}/entrenoLog/{iso}, un doc por día: cada
 * toque de + o − reescribe solo ese día, no todo el historial. La colección
 * entera se suscribe y se rearma en memoria con la forma { [iso]: día } de
 * siempre, así entrenoHelpers no sabe nada de Firestore.
 */
export function EntrenoProvider({ children, unit = 'kg', weightStep = 2.5 }) {
  const today = useMemo(() => new Date(), []);
  const todayIso = useMemo(() => isoOf(today), [today]);
  const todayKey = useMemo(
    () => (DAYS.find((d) => d.dow === today.getDay()) || DAYS[0]).key,
    [today]
  );

  const { currentUser } = useAuth();
  const uid = currentUser.uid;

  const [log, setLog] = useState({});
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(todayKey);
  const [view, setView] = useState('day');
  const [openEx, setOpenEx] = useState(null);
  const [activeSet, setActiveSet] = useState(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [frames, setFrames] = useState({});

  const { theme, toggleTheme } = useTheme();
  const { awake, toggleAwake } = useWakeLock();

  useEffect(() => {
    const col = collection(db, 'users', uid, 'entrenoLog');
    return onSnapshot(
      col,
      (snap) => {
        const next = {};
        snap.forEach((d) => {
          // eslint-disable-next-line no-unused-vars
          const { updatedAt, ...day } = d.data();
          next[d.id] = day;
        });
        setLog(next);
        setReady(true);
      },
      (err) => {
        console.error('No se pudo leer el historial', err);
        setReady(true);
      }
    );
  }, [uid]);

  useEffect(() => {
    migrateLegacyLog(uid).catch((err) => console.warn('Migración pendiente, se reintenta en la próxima carga', err));
  }, [uid]);

  /**
   * Guarda un día. El estado se actualiza al momento para que dos toques
   * seguidos no partan del mismo log; la escritura no se espera porque sin red
   * solo se resuelve al reconectar, y la caché de Firestore ya la encoló.
   */
  const persist = useCallback(
    (next, dIso) => {
      setLog(next);
      setDoc(doc(db, 'users', uid, 'entrenoLog', dIso), { ...next[dIso], updatedAt: serverTimestamp() }).catch(
        (err) => console.error('No se pudo guardar el día', dIso, err)
      );
    },
    [uid]
  );

  const day = BY_KEY[current];
  const iso = useMemo(() => dateForKey(current), [current]);

  const selectDay = useCallback((key) => {
    setCurrent(key);
    setView('day');
    setOpenEx(null);
    setActiveSet(null);
  }, []);

  const toggleView = useCallback(() => setView((v) => (v === 'week' ? 'day' : 'week')), []);

  const toggleOpenEx = useCallback((i) => setOpenEx((cur) => (cur === i ? null : i)), []);

  const toggleActiveSet = useCallback(
    (id) => setActiveSet((cur) => (cur === id ? null : id)),
    []
  );

  const cycleFrame = useCallback(
    (i) => setFrames((f) => ({ ...f, [i]: ((f[i] || 0) + 1) % 3 })),
    []
  );

  const writeSet = useCallback(
    (exKey, idx, len, patch) => persist(applySet(log, iso, day.key, exKey, idx, len, patch), iso),
    [persist, log, iso, day]
  );

  const setComment = useCallback(
    (exKey, text) => persist(applyComment(log, iso, day.key, exKey, text), iso),
    [persist, log, iso, day]
  );

  const resetDay = useCallback(() => {
    if (!log[iso]) return;
    const next = Object.assign({}, log);
    next[iso] = Object.assign({}, next[iso], { ex: {} });
    persist(next, iso);
    setActiveSet(null);
  }, [persist, log, iso]);

  const value = {
    // datos
    log, ready, day, iso, todayIso, todayKey, unit, weightStep,
    // estado de interfaz
    current, view, openEx, activeSet, leadOpen, frames, theme, awake,
    // acciones
    selectDay, toggleView, toggleOpenEx, toggleActiveSet, cycleFrame,
    writeSet, setComment, resetDay,
    toggleLead: () => setLeadOpen((v) => !v),
    toggleTheme, toggleAwake,
  };

  return <EntrenoContext.Provider value={value}>{children}</EntrenoContext.Provider>;
}
