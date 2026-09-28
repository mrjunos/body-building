import { beforeEach, describe, expect, it, vi } from 'vitest';
import { decodeHandoff, importLegacyHandoff } from './legacyHandoff.js';
import { LEGACY_KEY } from './legacyLog.js';

// El mismo código que usa redirect/index.html para empaquetar el historial.
function encode(log) {
  const bytes = new TextEncoder().encode(JSON.stringify(log));
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const log = {
  '2026-09-03': { dayKey: 'jue', notes: 'Codo raro, bajé peso — ñ', ex: { jalon_pecho: [{ w: 40, r: 8, done: true }, null] } },
};

describe('decodeHandoff', () => {
  it('recupera el historial tal cual, con acentos incluidos', () => {
    expect(decodeHandoff('#legacy=' + encode(log))).toEqual(log);
  });
  it('devuelve null si falta o viene roto', () => {
    expect(decodeHandoff('')).toBeNull();
    expect(decodeHandoff('#otra=1')).toBeNull();
    expect(decodeHandoff('#legacy=@@@')).toBeNull();
    expect(decodeHandoff('#legacy=' + encode([1, 2]))).toBeNull();
  });
});

describe('importLegacyHandoff', () => {
  let hist;
  beforeEach(() => {
    localStorage.clear();
    hist = { replaceState: vi.fn() };
  });

  const loc = (hash) => ({ hash, pathname: '/', search: '' });

  it('guarda el historial, limpia la URL y rearma la migración', () => {
    localStorage.setItem('entreno-migrated-v1:abc', 'x');
    localStorage.setItem('entreno-theme', 'dark');
    expect(importLegacyHandoff(loc('#legacy=' + encode(log)), localStorage, hist)).toBe(true);
    expect(JSON.parse(localStorage.getItem(LEGACY_KEY))).toEqual(log);
    expect(localStorage.getItem('entreno-migrated-v1:abc')).toBeNull();
    expect(localStorage.getItem('entreno-theme')).toBe('dark');
    expect(hist.replaceState).toHaveBeenCalledWith(null, '', '/');
  });

  it('lo que llega manda sobre una importación anterior, sin perder los otros días', () => {
    localStorage.setItem(LEGACY_KEY, JSON.stringify({ '2026-09-01': { ex: {} }, '2026-09-03': { ex: {} } }));
    importLegacyHandoff(loc('#legacy=' + encode(log)), localStorage, hist);
    const stored = JSON.parse(localStorage.getItem(LEGACY_KEY));
    expect(Object.keys(stored).sort()).toEqual(['2026-09-01', '2026-09-03']);
    expect(stored['2026-09-03']).toEqual(log['2026-09-03']);
  });

  it('sin fragmento no toca nada', () => {
    expect(importLegacyHandoff(loc(''), localStorage, hist)).toBe(false);
    expect(hist.replaceState).not.toHaveBeenCalled();
  });

  it('un fragmento roto se limpia de la URL sin escribir nada', () => {
    expect(importLegacyHandoff(loc('#legacy=@@@'), localStorage, hist)).toBe(false);
    expect(hist.replaceState).toHaveBeenCalled();
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });
});
