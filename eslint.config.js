// https://docs.expo.dev/guides/using-eslint/
// @ts-nocheck
import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';

export default defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
