// Application Business Rules UseCase naming conventions
// UseCaseメソッドはかならずInputDataを受け取ること（コード規約）

const useCaseInputDataConfig = {
  files: ['**/application-business-rules/ports/input/*.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'parameter',
        format: null,
        custom: {
          regex: 'InputData$|inputData$',
          match: true,
        },
        filter: {
          // confirmImport等の引数なしメソッドは対象外
          regex: '^(?!.*UseCase$)',
          match: false,
        },
      },
    ],
  },
};

export default [useCaseInputDataConfig];
