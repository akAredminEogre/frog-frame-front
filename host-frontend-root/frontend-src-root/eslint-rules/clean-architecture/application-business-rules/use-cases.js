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
        // catchバインディング変数（error, err, e, exception）は除外する
        selector: 'parameter',
        format: null,
        filter: {
          regex: '^(error|err|e|exception)$',
          match: false,
        },
        custom: {
          regex: 'InputData$|inputData$',
          match: true,
        },
      },
    ],
  },
};

// InteractorクラスはUseCaseインターフェースをimplementsすること
const interactorImplementsUseCaseConfig = {
  files: ['**/application-business-rules/interactors/**/*.ts'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "ClassDeclaration[id.name=/Interactor$/]:not(:has(TSClassImplements[expression.name=/UseCase$/]))",
        message:
          "Interactorクラスは対応するUseCaseインターフェース（I*UseCase）をimplementsしなければなりません。",
      },
    ],
  },
};

export default [useCaseInputDataConfig, interactorImplementsUseCaseConfig];
