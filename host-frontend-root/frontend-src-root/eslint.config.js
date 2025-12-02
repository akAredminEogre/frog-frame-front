// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';

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
    'simple-import-sort': simpleImportSort,
    'unused-imports': unusedImports,
    'no-relative-import-paths': noRelativeImportPaths,
  },
  rules: {
    // Import sorting with custom groups
    // DI container must be imported first to ensure reflect-metadata is loaded
    // before any classes with @injectable() decorator
    // NOTE: Set to 'warn' to show information-level hints in VSCode when imports are not sorted
    // This provides gentle guidance without blocking the build
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // Side effect imports (like 'reflect-metadata')
          ['^\\u0000'],
          // DI container import - MUST BE FIRST to initialize reflect-metadata
          ['^src/infrastructure/di/container$'],
          // Node.js builtins
          ['^node:'],
          // External packages
          ['^@?\\w'],
          // Internal packages starting with src/
          ['^src/'],
          // Parent imports (../)
          ['^\\.\\./'],
          // Current directory imports (./)
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'off',

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
  // Disable relative import path checking for CSS/style imports
  // CSS modules and style files should use relative paths as they are asset imports
  files: ['**/*.{ts,tsx,js,jsx}'],
  rules: {
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      {
        allowSameFolder: false,
        rootDir: 'src',
        prefix: 'src',
      },
    ],
  },
}, {
  // Background handlers: prohibit contentContainer import
  // Background script should use the main container with DexieRewriteRuleRepository
  files: ['**/handlers/background/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/contentContainer', '**/contentContainer.ts'],
            message: 'Background handlers must use "container" (not "contentContainer"). contentContainer is for Content Script only.',
          },
        ],
      },
    ],
  },
}, {
  // Content handlers: prohibit main container import
  // Content script should use contentContainer with ChromeRuntimeRewriteRuleRepository
  files: ['**/handlers/content/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/di/container', '**/di/container.ts'],
            message: 'Content handlers must use "contentContainer" (not "container"). container is for Background Script only.',
          },
        ],
      },
    ],
  },
}, {
  // contentOnMessageReceived UseCases: prohibit IChromeTabsService import
  // Content script context cannot use chrome.tabs API (only available in extension pages)
  files: ['**/usecases/contentOnMessageReceived/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/IChromeTabsService', '**/IChromeTabsService.ts'],
            message: 'contentOnMessageReceived UseCases cannot use IChromeTabsService. chrome.tabs API is not available in Content Script context.',
          },
        ],
      },
    ],
  },
}, {
  // Clean Architecture - Enterprise Business Rules Layer
  // This layer should not import from any other layers
  files: ['**/enterprise-business-rules/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '**/application-business-rules/**',
              '**/interface-adapters/**',
              '**/frameworks-and-drivers/**',
              '**/application/**',
              '**/infrastructure/**',
              '**/components/**',
              '**/entrypoints/**',
            ],
            message: 'Enterprise Business Rules layer must not depend on any other layers. It should contain only pure domain logic.',
          },
        ],
      },
    ],
  },
}, {
  // Clean Architecture - Application Business Rules Layer
  // This layer can only import from Enterprise Business Rules
  files: ['**/application-business-rules/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '**/interface-adapters/**',
              '**/frameworks-and-drivers/**',
              '**/infrastructure/**',
              '**/components/**',
              '**/entrypoints/**',
            ],
            message: 'Application Business Rules layer can only depend on Enterprise Business Rules layer, not on outer layers.',
          },
        ],
      },
    ],
  },
}, {
  // Clean Architecture - Interface Adapters Layer
  // This layer can import from inner layers but not from Frameworks & Drivers
  files: ['**/interface-adapters/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '**/frameworks-and-drivers/**',
              '**/infrastructure/browser/**',
              '**/infrastructure/persistance/**',
              '**/entrypoints/**',
            ],
            message: 'Interface Adapters layer must not depend on Frameworks & Drivers layer. It can only depend on inner layers.',
          },
        ],
      },
    ],
  },
}, {
  // Naming convention for directories - enforce kebab-case
  files: [
    '**/enterprise-business-rules/**/*.{ts,tsx}',
    '**/application-business-rules/**/*.{ts,tsx}',
    '**/interface-adapters/**/*.{ts,tsx}',
    '**/frameworks-and-drivers/**/*.{ts,tsx}',
  ],
  rules: {
    // This rule will help enforce naming conventions through file path validation
    'no-restricted-imports': [
      'warn',
      {
        patterns: [
          {
            group: ['**/*[A-Z]*/**'],
            message: 'Directory names should use kebab-case (lowercase with hyphens) according to docs/design/naming-rule.md',
          },
        ],
      },
    ],
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
