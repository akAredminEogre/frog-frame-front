// Base ESLint configuration - language options, globals, and plugin registration
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default {
  files: ['**/*.{ts,tsx,js,jsx}'],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.webextensions,
      ...globals.es2021,
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
    react: react,
    'react-hooks': reactHooks,
    'simple-import-sort': simpleImportSort,
    'unused-imports': unusedImports,
    'no-relative-import-paths': noRelativeImportPaths,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
