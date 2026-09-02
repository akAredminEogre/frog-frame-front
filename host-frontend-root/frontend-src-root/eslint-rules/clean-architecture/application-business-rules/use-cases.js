// Application Business Rules UseCase naming conventions
// ControllerからUseCaseへの呼び出し時にはInputDataを受け渡すことをerrorレベルで定める（殿指示 2026-03-02）

import { INTERACTORS_GLOB } from '#eslint-rules/object-oriented-nine-rules/globs.js';

// no-restricted-syntax selectors are exported and aggregated into
// object-oriented-nine-rules/main.js to avoid ESLint flat-config clobber
// (last matching config for a given rule key wins; OO9 comes after cleanArchitecture
// in eslint.config.js, so any no-restricted-syntax defined here alone would be
// silently overridden by the OO9 interactors config).
export const useCaseRestrictedSyntax = [
  {
    // UseCaseのexecuteメソッドパラメータはInputDataで終わること
    // AST: executeメソッドの直接パラメータのみを対象（コールバック・プライベートメソッドは除外）
    selector:
      "MethodDefinition[key.name='execute'] > FunctionExpression > .params[type='Identifier']:not([name=/InputData$/]):not([name=/^(error|err|e|exception|_.*)$/])",
    message:
      "UseCaseメソッドのパラメータはInputDataで終わること（例: exportRulesJsonInputData）",
  },
  {
    // InteractorクラスはUseCaseインターフェース（I*UseCase）をimplementsすること
    // メッセージ仕様に合わせ I 始まりの UseCase IF のみ許可（素の FooUseCase 命名は不可）
    selector:
      "ClassDeclaration[id.name=/Interactor$/]:not(:has(TSClassImplements[expression.name=/^I[A-Za-z0-9]*UseCase$/]))",
    message:
      "Interactorクラスは対応するUseCaseインターフェース（I*UseCase）をimplementsしなければなりません。",
  },
];

const useCaseConfig = {
  files: [INTERACTORS_GLOB],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        // コンストラクタDIパラメータプロパティは命名制約なし（repository, presenter等）
        selector: 'parameterProperty',
        format: null,
      },
    ],
    // no-restricted-syntax selectors are aggregated in OO9 main.js (see useCaseRestrictedSyntax export above).
  },
};

export default [useCaseConfig];
