# ISSUE-133 PULL REQUEST

## タイトル
refactor: content.tsのリスナー構造をClean Architecture・DDDの観点から再組織化

## 概要と理由
issue-132で実施したbackground.tsのリスナーファイルのディレクトリ移動・クラスリネーム作業を、content.tsのリスナーファイルにも適用しました。

従来のChrome API別組織化（`listeners/runtime/content/`）から、実行コンテキスト別組織化（`content/runtime/`）に変更し、content.tsに含まれることを明示的にしました。これにより、シーケンス図作成時やアーキテクチャ理解時の可視性が向上します。

## 主な変更点

### ディレクトリ構造の変更
- **旧構造**: `src/infrastructure/browser/listeners/runtime/content.onMessage.ts`
- **新構造**: `src/infrastructure/browser/content/runtime/onMessageReceived.ts`

### 移動されたファイル
- `listeners/runtime/content.onMessage.ts` → `content/runtime/onMessageReceived.ts`

### エクスポート名の変更
register〜形式から直接的な関数名に変更：
- `registerRuntimeOnMessageForContent` → `runtimeOnMessageReceived`

### Clean Architecture・DDD原則の適用
- **Bounded Context**: contentとbackgroundでコンテキストを分離
- **Aggregate Root**: 各Chrome APIのイベントをAggregate Rootとして扱う
- **依存関係の明確化**: content.tsからの依存関係を明示

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
  - TypeScriptコンパイル、リント、静的解析すべて成功を確認

## 補足
[追加の文脈や注意点]
- issue-132で確立したディレクトリ構造パターンを踏襲し一貫性を保持
- リファクタリング実行時にコンパイルエラーゼロを維持
- 対象ファイルが単一のリスナーのみのため、シンプルで安全な移行が可能

## 本スコープの対象外となったタスク
- E2Eテストを含む包括的テストの実行完了
- content関連の他のリスナーファイルの存在確認と移行（現在はruntime.onMessageのみ対象）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->