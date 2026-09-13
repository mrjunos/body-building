import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DAYS, BY_KEY } from '../data/days.js';
import { applySet, dateForKey, isoOf } from '../utils/entrenoHelpers.js';
import { useTheme } from '../hooks/useTheme.js';
import { useWakeLock } from '../hooks/useWakeLock.js';

const STORE_KEY = 'entreno-log-v1';

const EntrenoContext = createContext(null);

export function useEntreno() {
  const ctx = useContext(EntrenoContext);
  if (!ctx) throw new Error('useEntreno debe usarse dentro de <EntrenoProvider>');
  return ctx;
}

function readLog() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) || {} : {};
  } catch {
    return {};
  }
}

/**
 * Dueño de todo el estado de la app. Su API pública (log + acciones) es el
 * contrato que consumen los componentes; en la fase de Firebase cambia solo el
 * backend de `persist`, no esta interfaz.
 */
export function EntrenoProvider({ children, unit = 'kg', weightStep = 2.5 }) {
  const today = useMemo(() => new Date(), []);
  const todayIso = useMemo(() => isoOf(today), [today]);
  const todayKey = useMemo(
    () => (DAYS.find((d) => d.dow === today.getDay()) || DAYS[0]).key,
    [today]
  );

  const [log, setLog] = useState(readLog);
  const [current, setCurrent] = useState(todayKey);
  const [view, setView] = useState('day');
  const [openEx, setOpenEx] = useState(null);
  const [activeSet, setActiveSet] = useState(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [frames, setFrames] = useState({});

  const { theme, toggleTheme } = useTheme();
  const { awake, toggleAwake } = useWakeLock();

  const persist = useCallback((next) => {
    setLog(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* cuota llena o modo privado: la sesión sigue en memoria */
    }
  }, []);

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
    (exKey, idx, len, patch) => persist(applySet(log, iso, day.key, exKey, idx, len, patch)),
    [persist, log, iso, day]
  );

  const setNotes = useCallback(
    (value) => {
      const next = Object.assign({}, log);
      next[iso] = Object.assign({ dayKey: day.key, ex: {} }, next[iso] || {}, { notes: value });
      persist(next);
    },
    [persist, log, iso, day]
  );

  const resetDay = useCallback(() => {
    if (!log[iso]) return;
    const next = Object.assign({}, log);
    next[iso] = Object.assign({}, next[iso], { ex: {} });
    persist(next);
    setActiveSet(null);
  }, [persist, log, iso]);

  const value = {
    // datos
    log, day, iso, todayIso, todayKey, unit, weightStep,
    // estado de interfaz
    current, view, openEx, activeSet, leadOpen, frames, theme, awake,
    // acciones
    selectDay, toggleView, toggleOpenEx, toggleActiveSet, cycleFrame,
    writeSet, setNotes, resetDay,
    toggleLead: () => setLeadOpen((v) => !v),
    toggleTheme, toggleAwake,
  };

  return <EntrenoContext.Provider value={value}>{children}</EntrenoContext.Provider>;
}
