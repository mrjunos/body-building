import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, getDocFromCache, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase.js';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

const whitelistRef = () => doc(db, 'entreno_settings', 'users');

/**
 * Lee la lista blanca. Sin red va directo a la caché de IndexedDB: getDoc
 * acabaría cayendo en ella igual, pero solo tras esperar al servidor, y en el
 * gimnasio eso es una pantalla de carga de varios segundos.
 */
async function readWhitelist() {
  if (!navigator.onLine) {
    try {
      return await getDocFromCache(whitelistRef());
    } catch {
      /* nunca se leyó con red: toca intentarlo contra el servidor */
    }
  }
  return getDoc(whitelistRef());
}

/**
 * Sesión con Google y lista blanca de correos en entreno_settings/users,
 * como en mis-finanzas: si la lista no existe, el primer login la crea.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  const loginWithGoogle = useCallback(() => {
    setLoginError('');
    return signInWithPopup(auth, googleProvider);
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        const email = (user.email || '').toLowerCase();
        try {
          const snap = await readWhitelist();
          if (!snap.exists()) {
            // Primer login de todos: las reglas solo dejan crearla al dueño.
            await setDoc(whitelistRef(), { allowedEmails: [email] });
            setCurrentUser(user);
          } else if ((snap.data().allowedEmails || []).some((e) => e.toLowerCase() === email)) {
            setCurrentUser(user);
          } else {
            await signOut(auth);
            setLoginError('Acceso denegado: tu correo no está en la lista de usuarios autorizados.');
            setCurrentUser(null);
          }
        } catch (err) {
          if (err?.code === 'permission-denied') {
            await signOut(auth).catch(() => {});
            setLoginError('Acceso denegado: tu correo no está autorizado.');
            setCurrentUser(null);
          } else {
            // Sin red y sin la lista en caché: se deja pasar. Quien protege
            // los datos son las reglas de Firestore, no esta comprobación, y
            // echar de la sesión a alguien sin cobertura le deja sin app.
            console.warn('No se pudo comprobar la lista blanca', err);
            setCurrentUser(user);
          }
        }
        setLoading(false);
      }),
    []
  );

  const value = { currentUser, authLoading: loading, loginWithGoogle, logout, loginError };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
