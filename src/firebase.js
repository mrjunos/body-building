import { initializeApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from 'firebase/auth';

// Config web del proyecto: viene de .env (local) o de GitHub Variables (CI).
// No es secreta; se externaliza como en mis-finanzas. Ver .env.example.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Caché persistente en IndexedDB: es lo que deja registrar series sin red.
// Las escrituras se encolan y se vacían al reconectar, y onSnapshot sirve
// desde disco al instante, sin lógica de sincronización propia.
// ignoreUndefinedProperties: un campo sin valor en una serie no debe tumbar
// la escritura entera.
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Para probar en local sin tocar el proyecto real:
// VITE_USE_EMULATORS=true npm run dev, con `firebase emulators:start --only auth,firestore`.
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}
