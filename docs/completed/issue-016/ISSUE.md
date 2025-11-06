# 概要
<!-- このチケットで解決したい課題 -->
windows.getSelection()の呼び出しを抽象化し、テスト容易性を向上させる
about-window-selection.md に実装方針を記載しています。
それにそって実装を進めてください。


## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->
- [ ] `window.getSelection()` の記述が1箇所に集約されること。
  - [ ] `# 提案するディレクトリ構造` の `src/infrastructure/` ディレクトリに配置されていること。
- [ ] `ElementSelector.test.ts` において、`window.getSelection as any` の記述がなくなること。
- [ ] `ElementSelector` のテストが通ること。
- [ ] 既存のvitest、playwrightのテストがすべて通ること。

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->
- 仕様の変更は行わないこと。
- ユースケースに関わるテストシナリオの変更は行わないこと

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->
- [ ] about-window-selection.md のテキストを読み込む
- [ ] `CODING_STYLE.md` の `# 提案するディレクトリ構造` に従い、`window.getSelection()` を司るファイルを配置する
- [ ] 上記ロジックを呼び出すことで、`window.getSelection()` の記述を一箇所に集約する
- [ ] `ElementSelector.test.ts` において、`window.getSelection as any` のロジック記述を削除することを目指す
- [ ] テストの結果に応じて、必要な修正を行う