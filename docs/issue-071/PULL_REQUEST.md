# ISSUE-071: Tab値オブジェクトのリネーム

## タイトル
refactor: CurrentTabクラスをTabクラスにリネーム

## 概要と理由
ドメインモデルの命名を改善し、より汎用的で再利用可能な設計にするため、`CurrentTab`値オブジェクトを`Tab`にリネームしました。

**変更の理由:**
- `CurrentTab`という名前は「現在のタブ」という文脈に限定されすぎていた
- 実際には複数タブを扱うユースケースでも同じ値オブジェクトを使用できるため、より汎用的な`Tab`という名前が適切
- ドメイン駆動設計の観点から、値オブジェクトは特定のユースケースに依存しない名前であるべき

## 主な変更点

### 1. 値オブジェクトのリネーム
- `src/domain/value-objects/CurrentTab.ts` → `src/domain/value-objects/Tab.ts`
- クラス名: `CurrentTab` → `Tab`

### 2. 関連するインターフェースとサービスの更新
- `IChromeTabsService`: 新しい`Tab`型を使用するメソッドを追加
- `ICurrentTabService`: `Tab`型を返すように更新
- `IChromeRuntimeService`: `Tab`型を使用するように更新
- `ChromeTabsService`: `Tab`型のインスタンスを返す実装を追加
- `ChromeCurrentTabService`: `Tab`型を生成するように変更
- `ChromeRuntimeService`: `Tab`型を受け取るように変更

### 3. ユースケースの更新
- `SaveRewriteRuleAndApplyToCurrentTabUseCase`: `Tab`型を使用

### 4. テストの更新とリネーム
- `tests/unit/domain/value-objects/CurrentTab/*` → `tests/unit/domain/value-objects/Tab/*`
- すべてのテストファイルで`Tab`型を使用するように更新
- 新しいユースケースのテストを追加

### 5. ファイル変更統計
- 17ファイル変更
- 283行追加、73行削除
- リネームによるパスの変更を含む

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認
- すべてのユニットテストが成功することを確認
- 型エラーが発生しないことを確認

## 補足
- この変更は純粋なリファクタリングであり、機能的な変更は含まれない
- `Tab`という名前により、今後複数タブを扱う機能を追加する際の拡張性が向上
- インターフェースレベルでの抽象化から、値オブジェクトによる具体的な型定義への移行により、型安全性が向上

## 本スコープの対象外となったタスク
- 特になし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
