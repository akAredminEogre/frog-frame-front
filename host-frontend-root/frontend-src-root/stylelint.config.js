// stylelint 設定ファイル
// ルール設定は stylelint-rules/ ディレクトリに分割
//
// 関連ドキュメント:
// - docs/coding-standards/src/frameworks-and-drivers/ui/css-styling/index.md

import base from '#stylelint-rules/base.js';
import cssModules from '#stylelint-rules/css-modules.js';
import importPaths from '#stylelint-rules/import-paths.js';

/** @type {import('stylelint').Config} */
export default {
  extends: base.extends,
  rules: {
    ...base.rules,
    ...cssModules.rules,
    ...importPaths.rules,
  },
};
