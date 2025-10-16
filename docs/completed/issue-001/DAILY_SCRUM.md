# DAILY SCRUM

## 日付

2025/07/09 (1回目)

## 今日の作業予定
Story-1: 開発者として、保守性の高いコードベースを維持するために、`replaceInNode`のロジックをドメイン層に分離する（過渡期対応）

- `host-frontend-root/frontend-src-root`配下に`src`ディレクトリを新規作成する
- `wxt.config.ts`を更新し、`srcDir: 'src'`と`entrypointsDir: 'entrypoints'`を設定する
- `src`配下に`domain/entities`と`domain/entities/__tests__`ディレクトリを作成する

## 修正予定のファイル
- `frog-frame-front/host-frontend-root/frontend-src-root/wxt.config.ts`

## 相談事項
- 特にありません。計画通りに進めます。

## 一言コメント
- まずはアーキテクチャの基盤となるディレクトリ構造の整備から始めます。着実に進めていきましょう！

---

## 日付

2025/07/09 (2回目)

## 今日の作業予定
Story-1: 開発者として、保守性の高いコードベースを維持するために、`replaceInNode`のロジックをドメイン層に分離する（過渡期対応）

- **レビュー指摘事項の修正:**
    - `frog-frame-front/host-frontend-root/frontend-src-root/src/domain/entities/__tests__/.gitkeep` を作成済み。
- **`replaceInNode`のリファクタリング:**
    - `utils/domUtils.ts` にある `replaceInNode` を `src/domain/entities/NodeTextReplacer.ts` にドメインサービスとしてリファクタリングする。
    - `replaceInNode` が依存している `Keyword` 型を `src/domain/entities/Keyword.ts` に定義する。
- **ユニットテストの作成:**
    - `src/domain/entities/__tests__/NodeTextReplacer.test.ts` を作成し、`NodeTextReplacer` のユニットテストを実装する。
- **既存コードの修正:**
    - `content.ts` で `replaceInNode` を呼び出している箇所を、新しいドメインサービス `NodeTextReplacer` を使用するように修正する。

## 修正予定のファイル
- `frog-frame-front/host-frontend-root/frontend-src-root/src/domain/entities/Keyword.ts` (新規作成)
- `frog-frame-front/host-frontend-root/frontend-src-root/src/domain/entities/NodeTextReplacer.ts` (新規作成)
- `frog-frame-front/host-frontend-root/frontend-src-root/src/domain/entities/__tests__/NodeTextReplacer.test.ts` (新規作成)
- `frog-frame-front/host-frontend-root/frontend-src-root/utils/domUtils.ts` (削除)
- `frog-frame-front/host-frontend-root/frontend-src-root/entrypoints/content.ts` (修正)

## 相談事項
- 特にありません。計画通りに進めます。

## 一言コメント
- 前回のレビュー指摘を修正し、本題であるリファクタリングに着手します。ドメイン層への分離を丁寧に進め、保守性の向上を目指します。

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [ ] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [ ] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した

---

## 日付

2025/07/10 (1回目)

## 今日の作業予定
前回のレビューで発生した単体テストの失敗問題を解決する。

**主な課題：**
1. `entrypoints/__tests__/background.test.ts`で`Browser.tabs.sendMessage not implemented`エラー
2. `tabUtils.test.ts`で無効なURLエラー

**今日の作業：**
- `entrypoints/__tests__/background.test.ts`の`chrome.tabs.sendMessage`モックを適切に実装する
- `tabUtils.test.ts`の無効なURLテストケースを修正する
- 全ての単体テストが通るまで修正を続ける

## 修正予定のファイル
- `frog-frame-front/host-frontend-root/frontend-src-root/entrypoints/__tests__/background.test.ts`
- `frog-frame-front/host-frontend-root/frontend-src-root/utils/__tests__/tabUtils.test.ts`

## 相談事項
- 特にありません。前回のレビューコメントに従って問題を解決します。

## 一言コメント
- 前回のレビューで発生した単体テストの失敗を修正し、安定したテストスイートを構築します。モックの実装を適切に行い、全テストが通るようにします。

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [ ] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [ ] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した

---

## 日付

2025/07/10 (2回目)

## 今日の作業予定
issue-001のStory-1の現状整理と残り作業の確認

**現状分析：**
- `NodeTextReplacer`ドメインサービスと`RewriteRule`エンティティは既に実装済み
- 全ての単体テストが通っている状態
- PLAN.mdの内容が実際の進捗と一致していない

**今日の作業：**
- PLAN.mdを現在の実装状況に合わせて更新する
- issue-001のStory-1が完了しているかを確認する
- 完了していれば振り返りを実施し、次のStoryまたは新しいissueに進む準備をする

## 修正予定のファイル
- `frog-frame-front/docs/issue-001/PLAN.md`
- `frog-frame-front/docs/issue-001/RETROSPECTIVE.md` (必要に応じて)

## 相談事項
- Story-1が完了している場合、次に進むべき作業についてユーザーと相談したい

## 一言コメント
- 実装は順調に進んでいますが、計画書と実際の進捗に乖離があるため、現状を正確に把握して次のステップを明確にします。

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [x] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [x] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した

---