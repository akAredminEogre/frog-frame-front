// Enforce absolute import paths using 'tests/' alias in test files
// Prevents relative paths like '../helpers/' or redundant paths like 'src/../tests/'

export default {
  files: ['tests/**/*.{ts,tsx,js,jsx}'],
  rules: {
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      {
        allowSameFolder: false,
        rootDir: 'tests',
        prefix: 'tests',
      },
    ],
  },
};
