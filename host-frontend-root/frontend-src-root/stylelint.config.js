/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
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
    // 空のソースファイルを許可
    'no-empty-source': null,
  },
};
