// Frameworks and Drivers Messaging Service naming conventions
// See: docs/coding-standards/src/frameworks-and-drivers/messaging.md
//
// MessagingService: {Entity}MessagingService

// Only direct files in messaging/, not subdirectories
export default {
  files: ['**/frameworks-and-drivers/messaging/*.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'class',
        format: null,
        custom: {
          regex: 'MessagingService$',
          match: true,
        },
      },
    ],
  },
};
