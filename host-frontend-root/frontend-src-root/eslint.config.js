// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';

export default [js.configs.recommended, {
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
      browser: true,
      node: true,
      webextensions: true,
      es2021: true,
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
    react: react,
    'react-hooks': reactHooks,
    'unused-imports': unusedImports,
  },
  rules: {
    // TypeScript ESLintルール - 不使用変数を厳しくチェック
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        caughtErrors: 'all',
      },
    ],
    
    // 未使用のimportを検知・削除
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        caughtErrors: 'all',
      },
    ],
    
    // Reactの設定
    'react/react-in-jsx-scope': 'off', // React 17+では不要
    'react/prop-types': 'off', // TypeScriptを使っているので不要
    
    // React Hooksルール
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // その他の便利なルール
    'no-console': 'off', // 開発段階ではconsoleを許可
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'off', // TypeScript版を使用
    'no-undef': 'off', // 開発初期のため無効化
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}, {
  ignores: [
    'dist/**',
    'node_modules/**',
    '.wxt/**',
    '.output/**',
    '*.config.js',
    '*.config.ts',
  ],
}, ...storybook.configs["flat/recommended"]];
