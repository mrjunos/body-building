import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Corre contra el emulador: npm run test:rules

const OWNER = 'jjcadu@gmail.com';
let env;

const as = (uid, email, verified = true) =>
  env.authenticatedContext(uid, { email, email_verified: verified }).firestore();

const seedWhitelist = (emails = [OWNER]) =>
  env.withSecurityRulesDisabled((ctx) =>
    setDoc(doc(ctx.firestore(), 'entreno_settings/users'), { allowedEmails: emails })
  );

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-entreno',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});
afterAll(() => env.cleanup());
beforeEach(() => env.clearFirestore());

describe('lista blanca', () => {
  it('solo el dueño puede crearla, y solo consigo mismo dentro', async () => {
    await assertFails(setDoc(doc(as('x', 'otro@gmail.com'), 'entreno_settings/users'), { allowedEmails: ['otro@gmail.com'] }));
    await assertFails(setDoc(doc(as('j', OWNER), 'entreno_settings/users'), { allowedEmails: [OWNER, 'otro@gmail.com'] }));
    await assertFails(setDoc(doc(as('j', OWNER, false), 'entreno_settings/users'), { allowedEmails: [OWNER] }));
    await assertSucceeds(setDoc(doc(as('j', OWNER), 'entreno_settings/users'), { allowedEmails: [OWNER] }));
  });

  it('una vez creada, nadie de fuera la modifica ni puede volver a crearla', async () => {
    await seedWhitelist();
    await assertFails(updateDoc(doc(as('x', 'otro@gmail.com'), 'entreno_settings/users'), { allowedEmails: ['otro@gmail.com'] }));
    await assertSucceeds(updateDoc(doc(as('j', OWNER), 'entreno_settings/users'), { allowedEmails: [OWNER, 'amigo@gmail.com'] }));
  });

  it('cualquier sesión puede leerla, sin sesión no', async () => {
    await seedWhitelist();
    await assertSucceeds(getDoc(doc(as('x', 'otro@gmail.com'), 'entreno_settings/users')));
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'entreno_settings/users')));
  });
});

describe('historial', () => {
  const day = { dayKey: 'jue', notes: '', ex: { jalon_pecho: [{ w: 40, r: 8, done: true }] } };

  it('el dueño lee y escribe lo suyo', async () => {
    await seedWhitelist();
    const db = as('j', OWNER);
    await assertSucceeds(setDoc(doc(db, 'users/j/entrenoLog/2026-09-03'), day));
    await assertSucceeds(getDoc(doc(db, 'users/j/entrenoLog/2026-09-03')));
  });

  it('nadie toca el historial de otro uid, ni estando en la lista', async () => {
    await seedWhitelist([OWNER, 'amigo@gmail.com']);
    await assertFails(setDoc(doc(as('a', 'amigo@gmail.com'), 'users/j/entrenoLog/2026-09-03'), day));
    await assertFails(getDoc(doc(as('a', 'amigo@gmail.com'), 'users/j/entrenoLog/2026-09-03')));
  });

  it('fuera de la lista no se escribe ni en su propio uid', async () => {
    await seedWhitelist();
    await assertFails(setDoc(doc(as('x', 'otro@gmail.com'), 'users/x/entrenoLog/2026-09-03'), day));
  });

  it('sin lista blanca todavía, nadie accede al historial', async () => {
    await assertFails(setDoc(doc(as('j', OWNER), 'users/j/entrenoLog/2026-09-03'), day));
  });

  it('el resto de la base está cerrado', async () => {
    await seedWhitelist();
    await assertFails(setDoc(doc(as('j', OWNER), 'otra/cosa'), { a: 1 }));
  });
});
