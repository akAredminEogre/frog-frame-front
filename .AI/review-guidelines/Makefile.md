# Makefile レビューガイドライン

Makefileの変更時は以下を確認してください：

## 確認項目

- CLAUDE.mdの「Common Development Commands」セクションの更新が必要か
- 新規コマンド追加時はドキュメントへの記載を確認
- 既存コマンドの対象範囲・引数・オプションを変更した場合、CLAUDE.mdの説明も更新する
  - 例: `lintmd`の対象ディレクトリを追加した場合、CLAUDE.mdの説明に反映する
- Makefileコマンドと同等のnpmスクリプト(`package.json`)が存在する場合、両方を更新する
  - 例: `make checklinks`と`npm run check:links`は同じ対象ディレクトリを使用すべき
