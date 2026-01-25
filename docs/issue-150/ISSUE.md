# 概要
<!-- このチケットで解決したい課題 -->
プロジェクトにはCSSファイルが24個存在するが、CSSのlint（stylelint）が導入されていない。
ESLintでTypeScript/Reactのコード品質は担保されているが、CSSファイルの品質管理が行われていない状態。

stylelintを導入することで以下を実現する：
- CSSの一貫したコーディングスタイルの強制
- 一般的なCSSエラーの検出
- CSS Modulesとの互換性確保

## 現状分析
- CSSファイル: 24個（主にCSS Modules形式）
- SCSSやLESSは未使用
- ESLintはflat config形式で設定済み
- stylelint未導入

## 関連リンク
- [stylelint公式](https://stylelint.io/)
- [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->
- [ ] stylelintパッケージがインストールされている
- [ ] stylelint設定ファイル（stylelint.config.js）が存在する
- [ ] package.jsonにstylelint関連のnpmスクリプトが追加されている
- [ ] 既存の24個のCSSファイルがstylelintを通過する
- [ ] pre-commitフックでstylelintが実行される（ESLintと同様）

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->
- 既存CSSファイルにstylelintエラーが多数検出される可能性
- CSS Modulesの`:global`や`:composes`構文への対応

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->
- CSS Modulesとの互換性を維持すること
- 既存のESLint設定と競合しないこと

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->
- [x] stylelint関連パッケージのインストール
  - stylelint
  - stylelint-config-standard（標準ルールセット）
- [x] stylelint.config.jsの作成
- [x] package.jsonにnpmスクリプト追加
  - `stylelint`: CSSファイルのlint実行
  - `stylelint:fix`: 自動修正
- [x] pre-commitフックへのstylelint追加
- [ ] 既存CSSファイルのlint実行と修正（CIで検証）
- [ ] 動作確認（CIで検証）
