import { useCallback, useEffect, useState } from 'react';

const KEY = 'entreno-theme';

/**
 * Tema claro/oscuro. Se queda en localStorage a propósito: es preferencia de
 * dispositivo, y llevarla al servidor añadiría una ida y vuelta antes del
 * primer pintado.
 */
export function useTheme(defaultTheme = 'light') {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    let t = defaultTheme === 'dark' ? 'dark' : 'light';
    try {
      const s = localStorage.getItem(KEY);
      if (s === 'light' || s === 'dark') t = s;
    } catch {
      /* modo privado o almacenamiento bloqueado */
    }
    document.documentElement.dataset.theme = t;
    setTheme(t);
  }, [defaultTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const t = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = t;
      try {
        localStorage.setItem(KEY, t);
      } catch {
        /* ignorar */
      }
      return t;
    });
  }, []);

  return { theme, toggleTheme };
}
