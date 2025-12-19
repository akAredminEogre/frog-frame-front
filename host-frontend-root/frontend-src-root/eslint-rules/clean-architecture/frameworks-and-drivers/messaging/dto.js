// Frameworks and Drivers Messaging DTO naming conventions
// See: docs/coding-standards/src/frameworks-and-drivers/messaging/dto.md
//
// RequestDTO: {操作名}RequestDTO (in dto/request-dto/)
// EntityDTO: {Entity}DTO (in dto/)

// RequestDTO config: must end with RequestDTO
const requestDtoConfig = {
  files: ['**/frameworks-and-drivers/messaging/dto/request-dto/**/*.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: null,
        custom: {
          regex: 'RequestDTO$',
          match: true,
        },
      },
    ],
  },
};

// EntityDTO config: must end with DTO
const entityDtoConfig = {
  files: ['**/frameworks-and-drivers/messaging/dto/**/*.ts'],
  ignores: ['**/frameworks-and-drivers/messaging/dto/request-dto/**/*.ts'],
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

export default [requestDtoConfig, entityDtoConfig];
