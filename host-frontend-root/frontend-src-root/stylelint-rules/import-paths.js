// CSS インポートパスルール
// @import では絶対パス（src/*）を使用し、相対パス（../）は禁止
//
// 関連ドキュメント:
// - docs/coding-standards/src/frameworks-and-drivers/ui/css-styling/import-paths.md
//
// 注意:
// stylelint の標準ルールセットには @import パスの検証ルールがないため、
// このファイルは規約のドキュメント紐づけとして存在する。
// 実際の検証は PR レビューで確認する。
//
// 禁止: @import '../../../../../components/tokens.module.css'
// 許可: @import 'src/components/tokens.module.css'

export default {
  rules: {
    // 現時点では stylelint で相対パス禁止を自動検証する標準ルールがないため、
    // PR レビューで確認する
  },
};
