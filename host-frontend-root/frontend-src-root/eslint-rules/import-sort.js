// Import sorting rules
// DI container must be imported first to ensure reflect-metadata is loaded
// before any classes with @injectable() decorator

export default {
  files: ['**/*.{ts,tsx,js,jsx}'],
  rules: {
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
  },
};
