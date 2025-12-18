// Application Business Rules DTO naming conventions
// See: docs/coding-standards/src/application-business-rules/dto.md
//
// Input DTO: [機能名]InputData
// Output DTO: [機能名]OutputData

const inputDtoConfig = {
  files: ['**/application-business-rules/dto/input/**/*.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'class',
        format: null,
        custom: {
          regex: 'InputData$',
          match: true,
        },
      },
    ],
  },
};

const outputDtoConfig = {
  files: ['**/application-business-rules/dto/output/**/*.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'class',
        format: null,
        custom: {
          regex: 'OutputData$',
          match: true,
        },
      },
    ],
  },
};

export default [inputDtoConfig, outputDtoConfig];
