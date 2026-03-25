// Application Business Rules UseCase naming conventions
// ControllerからUseCaseへの呼び出し時にはInputDataを受け渡すことをerrorレベルで定める（殿指示 2026-03-02）

const useCaseConfig = {
  files: ['**/application-business-rules/interactors/**/*.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        // コンストラクタDIパラメータプロパティは命名制約なし（repository, presenter等）
        selector: 'parameterProperty',
        format: null,
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        // UseCaseのexecuteメソッドパラメータはInputDataで終わること
        // AST: executeメソッドの直接パラメータのみを対象（コールバック・プライベートメソッドは除外）
        selector:
          "MethodDefinition[key.name='execute'] > FunctionExpression > .params[type='Identifier']:not([name=/InputData$/]):not([name=/^(error|err|e|exception|_.*)$/])",
        message:
          "UseCaseメソッドのパラメータはInputDataで終わること（例: exportRulesJsonInputData）",
      },
      {
        // InteractorクラスはUseCaseインターフェースをimplementsすること
        selector:
          "ClassDeclaration[id.name=/Interactor$/]:not(:has(TSClassImplements[expression.name=/UseCase$/]))",
        message:
          "Interactorクラスは対応するUseCaseインターフェース（I*UseCase）をimplementsしなければなりません。",
      },
    ],
  },
};

export default [useCaseConfig];
