// Funciones puras portadas verbatim desde Entreno.dc.html: no dependen de React
// ni del almacenamiento, así que sobreviven intactas al cambio a Firestore.
import { BY_KEY } from '../data/days.js';

const MONTH = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const isoOf = (d) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export const shortDate = (iso) => {
  const p = iso.split('-');
  return Number(p[2]) + ' ' + MONTH[Number(p[1]) - 1];
};

export const num = (v) => typeof v === 'number' && isFinite(v);

/** La fecha de esta semana que le toca a un día de la rutina. */
export function dateForKey(key) {
  const d = BY_KEY[key];
  const today = new Date();
  const diff = (d.dow === 0 ? 7 : d.dow) - (today.getDay() === 0 ? 7 : today.getDay());
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate() + diff);
  return isoOf(t);
}

export function entry(log, iso, exKey) {
  const day = log[iso];
  return day && day.ex ? day.ex[exKey] : null;
}

/** Todas las sesiones registradas de un ejercicio, de más reciente a más antigua. */
export function sessionsFor(log, exKey, excludeIso) {
  const out = [];
  Object.keys(log)
    .sort()
    .reverse()
    .forEach((iso) => {
      if (iso === excludeIso) return;
      const sets = entry(log, iso, exKey);
      if (sets && sets.some((s) => s && s.done)) out.push({ iso, sets });
    });
  return out;
}

/**
 * Las series a mostrar para un ejercicio hoy. Si no hay nada registrado,
 * arrastra el valor de la serie anterior, y si no, el de la última sesión.
 */
export function setsFor(log, ex, iso) {
  const stored = entry(log, iso, ex.k);
  const prev = sessionsFor(log, ex.k, iso)[0];
  const out = [];
  for (let i = 0; i < ex.s; i++) {
    const st = stored && stored[i] ? stored[i] : null;
    const pv = prev && prev.sets[i] ? prev.sets[i] : prev ? prev.sets[prev.sets.length - 1] : null;
    const carry = stored
      ? stored
          .slice(0, i)
          .reverse()
          .find((x) => x && (num(x.w) || num(x.r) || num(x.min)))
      : null;
    const base = st || carry || pv || {};
    out.push(
      ex.run
        ? {
            min: num(st && st.min) ? st.min : num(base.min) ? base.min : 30,
            km: num(st && st.km) ? st.km : num(base.km) ? base.km : 5,
            done: !!(st && st.done),
          }
        : {
            w: num(st && st.w) ? st.w : num(base.w) ? base.w : 20,
            r: num(st && st.r) ? st.r : num(base.r) ? base.r : 10,
            done: !!(st && st.done),
          }
    );
  }
  return out;
}

/** Aplica un parche a una serie y devuelve el log nuevo, sin mutar el anterior. */
export function applySet(log, iso, dayKey, exKey, idx, len, patch) {
  const next = Object.assign({}, log);
  const day = Object.assign({ dayKey, notes: '' }, next[iso] || {});
  day.ex = Object.assign({}, day.ex || {});
  const cur = (day.ex[exKey] || []).slice();
  while (cur.length < len) cur.push(null);
  cur[idx] = Object.assign({}, cur[idx] || {}, patch);
  day.ex[exKey] = cur;
  next[iso] = day;
  return next;
}

export function paceOf(min, km) {
  if (!num(min) || !num(km) || km <= 0) return '—';
  const p = min / km;
  const m = Math.floor(p);
  const s = Math.round((p - m) * 60);
  return m + ':' + String(s).padStart(2, '0') + ' /km';
}

export function countDay(log, d, dIso) {
  let total = 0;
  let done = 0;
  d.ex.forEach((e) => {
    total += e.s;
    const s = entry(log, dIso, e.k);
    if (s) done += s.filter((x) => x && x.done).length;
  });
  return { total, done };
}

/** Un día mixto combina pesas y carrera: hay que anunciarlo en la card. */
export function runInfo(d) {
  const r = d.ex.find((e) => e.run);
  return { mixes: !!r && d.ex.some((e) => !e.run), label: r ? r.n : '' };
}

/** El récord del ejercicio, mirando todas las sesiones más la de hoy. */
export function prFor(log, exKey, iso) {
  const sessions = sessionsFor(log, exKey, iso);
  const todays = entry(log, iso, exKey);
  let pr = null;
  sessions.concat(todays ? [{ iso, sets: todays }] : []).forEach((s) => {
    s.sets.forEach((x) => {
      if (!x || !x.done || !num(x.w)) return;
      if (!pr || x.w > pr.w || (x.w === pr.w && num(x.r) && x.r > pr.r)) {
        pr = { w: x.w, r: num(x.r) ? x.r : 0 };
      }
    });
  });
  return pr;
}
