// CSS Modules 対応ルール
// CSS Modules 固有の構文を許可する設定
//
// 関連ドキュメント:
// - docs/coding-standards/src/frameworks-and-drivers/ui/css-styling/index.md

export default {
  rules: {
    // CSS Modules の :global と :local 擬似セレクタを許可
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ],
    // CSS Modules の `composes` を許可（他のモジュールのスタイル合成に必要）
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],
    // CSS Modules のクラス名パターンを許可（camelCase等）
    'selector-class-pattern': null,
  },
};
