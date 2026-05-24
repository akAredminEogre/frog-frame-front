# ISSUE-100 PULL REQUEST

## タイトル
RewriteRule.idの型を一時的にstring | numberに変更

## 概要と理由
local.storageからIndexedDBに切り替える措置として、RewriteRule.idの型を一時的に`string | number`に変更しました。これにより、既存の文字列IDとIndexedDBの数値IDの両方を受け入れられるようになり、段階的な移行が可能になります。

## 主な変更点

### ドメイン層の変更
- **RewriteRule.ts**: `id`プロパティの型を`string`から`string | number`に変更
- **RewriteRules.ts**:
  - `getById()`メソッドのパラメータ型を`string | number`に変更
  - `set()`メソッドで`Map.set()`呼び出し時に`String(rule.id)`で文字列変換を追加（Mapのキーは常に文字列）

### アプリケーション層の変更
- **OpenRuleEditPageUseCase.ts**: `execute()`メソッドのパラメータ型を`string | number`に変更し、`openEditPage()`呼び出し時に`String(ruleId)`で変換

### インフラ層の変更
- **DexieRewriteRuleRepository.ts**:
  - `convertStringIdToNumber()`メソッドのパラメータ型を`string | number`に変更
  - エラーメッセージを"Expected a numeric string or number."に更新
  - `getById()`メソッドのパラメータ型を`string | number`に変更
  - `RewriteRuleNotFoundError`呼び出し時に`String(id)`で変換

### エントリーポイント層の変更
- **RulesApp.tsx**: `handleEdit()`関数のパラメータ型を`string | number`に変更

### テストコードの変更

**一貫性の向上（Scrum 01）:**
- オブジェクトリテラルで数値キーを使用（`{1: rule1, 2: rule2}`）
- プロパティアクセスを数値で統一（`object[1]`）
- `getById()`の呼び出しを数値IDに変更（`getById(1)`）

**型対応とモック統一（Scrum 02）:**
- `OpenRuleEditPageUseCase`テスト: `createMockTabsService()`ヘルパー関数を使用してモック作成を統一
- `DexieRewriteRuleRepository`テスト: エラーメッセージの期待値を更新

**変更ファイル数:**
- 本体コード: 6ファイル
- テストコード: 14ファイル

## テスト方法
- `make test-and-check` で回帰テスト通過を確認
  - 全277件の単体テスト + 9件のE2Eテストが成功
  - TypeScriptコンパイルエラーなし
  - Lintエラーなし

## 補足
この変更は、local.storageからIndexedDBへの移行のための一時的な措置です。将来的には`number`型のみに統一する予定です。

### 2回のDaily Scrumで実施
- **Scrum 01**: RewriteRule.idの型変更とテストコードの一貫性向上（4イテレーション）
- **Scrum 02**: コンパイルエラー対処とテストモックの統一（2イテレーション）

### KPT振り返りから得られた教訓
- 型変更時は将来の完全移行を見据えた設計が重要
- テストコードの一貫性（リテラル、アクセス、呼び出し）を最初から考慮する
- 既存のヘルパー関数の存在を確認し、コードの重複を避ける

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
