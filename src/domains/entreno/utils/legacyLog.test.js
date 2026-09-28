import { describe, expect, it } from 'vitest';
import { isEmptyDay, planMigration, readLegacyLog } from './legacyLog.js';

const set = { w: 40, r: 8, done: true };

describe('isEmptyDay', () => {
  it('un día sin series tocadas ni notas está vacío', () => {
    expect(isEmptyDay(undefined)).toBe(true);
    expect(isEmptyDay({ dayKey: 'jue', notes: '', ex: {} })).toBe(true);
    expect(isEmptyDay({ dayKey: 'jue', notes: '  ', ex: { jalon_pecho: [null, null] } })).toBe(true);
  });
  it('una serie o una nota bastan para que tenga datos', () => {
    expect(isEmptyDay({ ex: { jalon_pecho: [null, set] } })).toBe(false);
    expect(isEmptyDay({ notes: 'hombro raro', ex: {} })).toBe(false);
  });
});

describe('planMigration', () => {
  const legacy = {
    '2026-09-01': { dayKey: 'mar', notes: '', ex: { a: [set] } },
    '2026-09-03': { dayKey: 'jue', notes: '', ex: { b: [set] } },
    '2026-09-04': { dayKey: 'vie', notes: '', ex: {} },
    'basura': { ex: { a: [set] } },
  };

  it('sube los días con datos, en orden, y descarta los vacíos y las claves raras', () => {
    expect(planMigration(legacy, {}).map(([iso]) => iso)).toEqual(['2026-09-01', '2026-09-03']);
  });

  it('no pisa un día que ya tiene datos en Firestore', () => {
    const existing = { '2026-09-03': { ex: { b: [{ w: 50, r: 6, done: true }] } } };
    expect(planMigration(legacy, existing).map(([iso]) => iso)).toEqual(['2026-09-01']);
  });

  it('sí rellena un doc que existe pero está vacío', () => {
    const existing = { '2026-09-03': { dayKey: 'jue', notes: '', ex: {} } };
    expect(planMigration(legacy, existing).map(([iso]) => iso)).toEqual(['2026-09-01', '2026-09-03']);
  });
});

describe('readLegacyLog', () => {
  const store = (v) => ({ getItem: () => v });
  it('tolera la clave ausente o corrupta', () => {
    expect(readLegacyLog(store(null))).toEqual({});
    expect(readLegacyLog(store('{roto'))).toEqual({});
    expect(readLegacyLog(store('[1,2]'))).toEqual({});
  });
});
