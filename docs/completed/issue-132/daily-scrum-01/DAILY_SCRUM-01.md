# DAILY SCRUM-01回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->
- 現在のbackground.tsのリスナー構造を分析し、移動対象を特定
- Clean Architecture、DDDの観点から最適なディレクトリ構造を設計

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->
- src/entrypoints/background.ts（現在のリスナー構造分析）
- src/infrastructure/browser/listeners/（既存構造の把握）
- docs/issue-132/（分析結果とディレクトリ設計の文書化）

## スクラム内残タスク
- [x] 現在のbackground.tsのリスナー構造を分析し、移動対象を特定
- [x] Clean Architecture、DDDの観点から最適なディレクトリ構造を設計
- [x] backgroundリスナーのリファクタリング実装
- [x] レビューコメントに応じたスコープ調整（content.ts関連を対象外とする）

## 相談事項
<!-- workflow-01-create-daily-scrum-doc-after-coding.mdの場合は作成しない -->
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->
<!-- ユーザーが使うコマンド: frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-discussion-then-start-coding.md-->

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->
background.tsのリスナー構造を整理して、シーケンス図作成時の理解しやすさを向上させたい

# DAILY SCRUM-01作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

1. **現在のbackground.tsリスナー構造の分析**
   - 4つのリスナー（contextMenus, runtime onInstalled/onMessage, tabs onUpdated）を特定
   - 既存のlisteners/配下の構造を調査
   - Chrome API別組織化の課題を明確化

2. **Clean Architecture・DDDに基づく新構造設計**
   - 実行コンテキスト別の組織化を設計
   - background/とcontent/でのコンテキスト分離
   - Bounded Context原則とAggregate Rootパターンの適用

3. **backgroundリスナーのリファクタリング実装**
   - 新ディレクトリ構造の作成（background/contextMenus/, runtime/, tabs/）
   - ファイル移動とリネーム（export名をregister〜から直接的な名前に変更）
   - background.tsのインポートと関数呼び出しを更新
   - 古いlisteners/ディレクトリの削除

4. **スコープ調整**
   - レビューコメントに応じてcontent.ts関連を対象外とし、変更を打ち消し
   - PLAN.mdに対象外課題として明記

## 修正したファイル
<!-- スクラム単位での変更を記入 -->
<!-- 進捗としては変化があっても、スクラムとして変更がなかったファイルは記入しない -->

**新規作成ファイル:**
- docs/issue-132/background-listener-analysis.md (分析結果と設計文書)
- host-frontend-root/frontend-src-root/src/infrastructure/browser/background/ (新ディレクトリ構造)
  - contextMenus/onClicked.ts
  - runtime/onExtensionInstalled.ts
  - runtime/onMessageReceived.ts
  - tabs/onUpdated.ts

**更新ファイル:**
- host-frontend-root/frontend-src-root/src/entrypoints/background.ts (インポートと関数呼び出しを新構造に更新)
- docs/issue-132/PLAN.md (対象外課題を追加、完了タスクを更新)

**削除したファイル:**
- host-frontend-root/frontend-src-root/src/infrastructure/browser/listeners/ (ディレクトリ全体)