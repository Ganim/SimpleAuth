import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  globalIgnores(['build/**/*'], 'Ignore Build Directory'),
  globalIgnores(['node_modules/*'], 'Ignore Node Modules Directory'),
  globalIgnores(['generated/*'], 'Ignore Generated Prisma Directory'),
  globalIgnores(['prisma/*'], 'Ignore Generated Prisma Directory'),
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
]);
