// Application Business Rules UseCase naming conventions
// ControllerからUseCaseへの呼び出し時にはInputDataを受け渡すことをerrorレベルで定める（殿指示 2026-03-02）
// 設計補足: confirmImport() 等の引数なしメソッドは2フェーズ設計（previewImport → confirmImport）の確認フェーズとして許可。
// InputData の受け渡しは Phase 1 の入力フェーズ（importRulesJson 等）で保証されており、
// Phase 2 の確認フェーズは前回入力の pending 状態を消費するため引数を必要としない。

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

export default [useCaseInputDataConfig];
