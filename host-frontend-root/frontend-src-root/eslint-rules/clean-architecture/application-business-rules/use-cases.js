// Application Business Rules UseCase naming conventions
// ControllerからUseCaseへの呼び出し時にはInputDataを受け渡すことをerrorレベルで定める（殿指示 2026-03-02）

const useCaseInputDataConfig = {
  files: ['**/application-business-rules/interactors/**/*.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        // コンストラクタDIパラメータプロパティは命名制約なし（repository, presenter等）
        selector: 'parameterProperty',
        format: null,
      },
      {
        // UseCaseメソッドのパラメータはInputDataで終わること
        selector: 'parameter',
        format: null,
        custom: {
          regex: 'InputData$|inputData$',
          match: true,
        },
      },
    ],
  },
};

export default [useCaseInputDataConfig];
