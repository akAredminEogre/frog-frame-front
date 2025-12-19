// Frameworks and Drivers Messaging DTO naming conventions
// See: docs/coding-standards/src/frameworks-and-drivers/messaging/dto.md
//
// RequestDTO: {操作名}RequestDTO
// EntityDTO: {Entity}DTO

export default {
  files: ['**/frameworks-and-drivers/messaging/dto/**/*.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: null,
        custom: {
          regex: 'DTO$',
          match: true,
        },
      },
    ],
  },
};
