// 基本設定 - stylelint-config-standard を拡張
// stylelint のベース設定を定義

export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // 空のソースファイルを許可
    'no-empty-source': null,
  },
};
