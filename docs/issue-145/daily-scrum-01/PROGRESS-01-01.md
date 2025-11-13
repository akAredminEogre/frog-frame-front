# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=01
実装が完了したらPROGRESS-01-01.mdを追記してコードレビューを依頼してください

## スクラム-01(01回目) の進捗

Day 1タスク「既存実装の調査と00-overview.md作成」を完了しました。

### 完了した作業内容

1. **既存実装の調査**
   - srcディレクトリ構造の確認（101個のTypeScriptファイル）
   - UseCaseの一覧化（11個のUseCase）
     - contextmenu: 2個
     - popup: 1個
     - rule: 6個
     - selection: 1個
     - window: 1個
   - Entityの一覧化（10個のEntity/Strategy）
     - RewriteRule関連: 5個（本体 + Strategy系）
     - DOM操作関連: 5個
   - ValueObjectの確認（7個）
   - 技術スタックの確認（package.json）
     - WXT, React, TypeScript, tsyringe, Dexie等

2. **docs/design/ディレクトリ構造の作成**
   - `docs/design/` - 設計ドキュメントルート
   - `docs/design/adr/` - ADRディレクトリ
   - `docs/design/screens/popup/` - Popup画面仕様
   - `docs/design/screens/edit/` - Edit画面仕様

3. **00-overview.md の作成**
   - プロジェクト基本情報
   - 技術スタックと採用理由の表
   - Clean Architecture層構造の図解
   - Chrome拡張特有の方式設計
     - 実行コンテキストの分離方針
     - entry pointsの薄層化方針
     - ストレージ戦略（Dexie採用理由）
   - Atomic Design方針
   - 詳細なディレクトリ構成（実際の実装を反映）
   - 開発フロー
   - ブランチ戦略
   - AI支援開発の方針
   - テスト戦略
   - ADR一覧（今後作成予定の3つを記載）

### 修正したファイル

**新規作成:**
- `docs/design/00-overview.md` - プロジェクト概要・方式設計書

**作成したディレクトリ:**
- `docs/design/`
- `docs/design/adr/`
- `docs/design/screens/popup/`
- `docs/design/screens/edit/`

### 次回以降のスクラムに先送りする課題

なし（Day 1タスクは完了）

### 本issueの対象外とする課題

なし

### スクラム-01(01回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md -->
作成ありがとうございました。いくつかの点はこちらの方で手動で修正、コミットしました。
下記の点について修正をお願いします

- `**層構造:**` については、plantumlで記述してください。
  - そして、今後plantumlから画像が生成された際の仮の保存場所を決めて、そこへのリンクを貼っておいてください。

- `Git Flow` について
```
## 4. ブランチ戦略

### Git Flow（簡易版）


```
main          ────●────────●──────●─────→ (プロダクション)
               ↗        ↗        ↗
develop    ───●───●───●───●───●───●───→ (開発中)
             ↗   ↗   ↗   ↗   ↗   ↗
issue-nnn ─●   ●   ●   ●   ●   ●
```

- `main`: リリース用ブランチ
- `develop`: 開発中ブランチ（デフォルト）
- `issue-nnn-xxx`: Issue番号ベースの機能開発ブランチ

---
```
とありますが、`0.1.1.1` のようなリリースブランチを切っていることを記述してください。
---
