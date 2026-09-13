import { describe, expect, it } from 'vitest';
import { applySet, countDay, paceOf, prFor, runInfo, sessionsFor, setsFor, shortDate } from './entrenoHelpers.js';
import { BY_KEY } from '../data/days.js';

const jue = BY_KEY.jue;
const jalon = jue.ex[0]; // Jalón al pecho, 3 series

describe('shortDate', () => {
  it('formatea en español y sin ceros a la izquierda', () => {
    expect(shortDate('2026-09-03')).toBe('3 sep');
    expect(shortDate('2026-01-15')).toBe('15 ene');
  });
});

describe('paceOf', () => {
  it('calcula el ritmo por kilómetro', () => {
    expect(paceOf(30, 5)).toBe('6:00 /km');
    expect(paceOf(25, 4)).toBe('6:15 /km');
  });
  it('no divide por cero', () => {
    expect(paceOf(30, 0)).toBe('—');
    expect(paceOf(undefined, 5)).toBe('—');
  });
});

describe('applySet', () => {
  it('no muta el log anterior', () => {
    const log = {};
    const next = applySet(log, '2026-09-10', 'jue', 'jalon_pecho', 0, 3, { w: 40, r: 8, done: true });
    expect(log).toEqual({});
    expect(next['2026-09-10'].ex.jalon_pecho[0]).toEqual({ w: 40, r: 8, done: true });
  });
  it('rellena con huecos hasta el índice pedido', () => {
    const next = applySet({}, '2026-09-10', 'jue', 'jalon_pecho', 2, 3, { w: 40, r: 8, done: true });
    expect(next['2026-09-10'].ex.jalon_pecho).toHaveLength(3);
    expect(next['2026-09-10'].ex.jalon_pecho[0]).toBeNull();
  });
});

describe('setsFor', () => {
  it('arrastra el peso de la serie anterior del mismo día', () => {
    const log = applySet({}, '2026-09-10', 'jue', 'jalon_pecho', 0, 3, { w: 45, r: 9, done: true });
    const sets = setsFor(log, jalon, '2026-09-10');
    expect(sets[1].w).toBe(45);
    expect(sets[1].done).toBe(false);
  });
  it('usa valores por defecto cuando no hay historial', () => {
    const sets = setsFor({}, jalon, '2026-09-10');
    expect(sets).toHaveLength(3);
    expect(sets[0]).toEqual({ w: 20, r: 10, done: false });
  });
});

describe('sessionsFor', () => {
  it('devuelve las sesiones de más reciente a más antigua y excluye la de hoy', () => {
    let log = applySet({}, '2026-09-03', 'jue', 'jalon_pecho', 0, 3, { w: 40, r: 8, done: true });
    log = applySet(log, '2026-09-10', 'jue', 'jalon_pecho', 0, 3, { w: 45, r: 8, done: true });
    const s = sessionsFor(log, 'jalon_pecho', '2026-09-10');
    expect(s).toHaveLength(1);
    expect(s[0].iso).toBe('2026-09-03');
  });
  it('ignora series no marcadas', () => {
    const log = applySet({}, '2026-09-03', 'jue', 'jalon_pecho', 0, 3, { w: 40, r: 8, done: false });
    expect(sessionsFor(log, 'jalon_pecho', null)).toHaveLength(0);
  });
});

describe('prFor', () => {
  it('se queda con el peso más alto, y a igual peso con más reps', () => {
    let log = applySet({}, '2026-09-03', 'jue', 'jalon_pecho', 0, 3, { w: 50, r: 6, done: true });
    log = applySet(log, '2026-09-03', 'jue', 'jalon_pecho', 1, 3, { w: 50, r: 9, done: true });
    log = applySet(log, '2026-09-03', 'jue', 'jalon_pecho', 2, 3, { w: 45, r: 12, done: true });
    expect(prFor(log, 'jalon_pecho', '2026-09-10')).toEqual({ w: 50, r: 9 });
  });
  it('no cuenta series sin marcar', () => {
    const log = applySet({}, '2026-09-03', 'jue', 'jalon_pecho', 0, 3, { w: 99, r: 6, done: false });
    expect(prFor(log, 'jalon_pecho', '2026-09-10')).toBeNull();
  });
});

describe('countDay', () => {
  it('cuenta el total de series del día y las hechas', () => {
    const log = applySet({}, '2026-09-10', 'jue', 'jalon_pecho', 0, 3, { w: 40, r: 8, done: true });
    expect(countDay(log, jue, '2026-09-10')).toEqual({ total: 16, done: 1 });
  });
});

describe('runInfo', () => {
  it('marca como mixto el día que combina pesas y carrera', () => {
    expect(runInfo(BY_KEY.jue).mixes).toBe(true);
    expect(runInfo(BY_KEY.lun).mixes).toBe(false);
    // miércoles es carrera entera: no es mixto, el título ya lo dice
    expect(runInfo(BY_KEY.mie).mixes).toBe(false);
  });
});
