// Disable relative import path checking for CSS/style imports
// CSS modules and style files should use relative paths as they are asset imports

export default {
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
};
