import { defineConfig } from 'vitest/config';

// Tests de firestore.rules: necesitan el emulador, así que van aparte del
// `npm test` normal (que es el que corre CI). Ver el script test:rules.
export default defineConfig({
  test: {
    include: ['tests/rules/**/*.test.js'],
    environment: 'node',
  },
});
