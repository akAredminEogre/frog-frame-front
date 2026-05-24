# テスト戦略書移行プロセス明確化ガイドライン

リファクタリング時のテスト戦略書移行プロセスを明確に記述するためのガイドライン。

## 基本原則

### 1. 作成 vs 移動の明確化

テスト戦略書の扱いについて、以下を明確に区別する：

- **新規作成**: リファクタリング時に新しい場所にテスト戦略書を作成
- **ファイル移動**: 既存ファイルを物理的に移動
- **削除**: 旧ファイルの削除

### 2. フェーズごとの明確な記述

各Phaseで何が起こるかを具体的に記載する。

## 記述パターン

### パターンA: 新規作成 + 旧ファイル削除

リファクタリング時に新しいクラス用のテスト戦略書を新規作成し、旧ファイルは削除する場合。

#### 良い例

```markdown
### Phase 2: 実装・単体テスト

#### 第2層: application-business-rules

- [ ] UpdateRewriteRuleInteractor の実装、テスト戦略書・単体テスト
  - IChromeTabsService → ITabsGateway への変更
  - Presenter経由のエラーハンドリング導入
  - テスト戦略書を新しい場所に作成: `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`

### Phase 4: 旧コード削除

- [ ] 旧 UpdateRewriteRuleUseCase の削除
- [ ] 旧テスト戦略書の削除（`docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md`）
  - 新しいテスト戦略書はPhase 2で作成済みのため、旧ファイルは単純削除
```

#### 悪い例（曖昧な表現）

```markdown
# 曖昧で誤解を招く表現
### Phase 2: 実装・単体テスト
- [ ] テスト戦略書の配置変更: `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`

### Phase 4: 旧コード削除
- [ ] 旧テスト戦略書の移動（`docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md` → `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`）
```

**問題点**: 
- Phase 2で「配置変更」、Phase 4で「移動」と表現が一貫していない
- 新規作成なのかファイル移動なのかが不明確

### パターンB: ファイル移動（コンテンツ更新なし）

既存のテスト戦略書をそのままの内容で新しい場所に移動する場合。

#### 良い例

```markdown
### Phase 2: 実装・単体テスト

- [ ] UpdateRewriteRuleInteractor の実装・単体テスト
  - 既存のテスト戦略書をそのまま利用

### Phase 4: 旧コード削除

- [ ] テスト戦略書の移動
  - 移動元: `docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md`
  - 移動先: `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`
  - 内容は更新せず、ファイルパスのみ変更
```

### パターンC: コンテンツ更新 + ファイル移動

テスト戦略書の内容を更新してから新しい場所に移動する場合。

#### 良い例

```markdown
### Phase 2: 実装・単体テスト

- [ ] UpdateRewriteRuleInteractor の実装・単体テスト
  - 既存のテスト戦略書の内容を新しいクラス構造に合わせて更新
  - 更新場所: `docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md`

### Phase 4: 旧コード削除

- [ ] テスト戦略書の移動
  - 移動元: `docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md`
  - 移動先: `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`
  - Phase 2で内容は更新済み、ファイルパスのみ変更
```

## 用語の統一

### 推奨用語

- **作成**: 新しいファイルを作成する場合
- **更新**: 既存ファイルの内容を変更する場合
- **移動**: ファイルを別の場所に移す場合
- **削除**: ファイルを除去する場合

### 避けるべき曖昧な表現

- ❌ 「配置変更」（新規作成か移動かが不明）
- ❌ 「テスト戦略書の移動」（Phase 2とPhase 4で異なる意味で使用）
- ❌ 「ファイルパスの更新」（物理的移動かリンクの変更かが不明）

### 推奨表現

- ✅ 「テスト戦略書を新しい場所に作成」
- ✅ 「テスト戦略書を〜から〜に移動」
- ✅ 「旧テスト戦略書を削除」

## チェックリスト

### ドキュメント作成時の確認点

1. **プロセスの明確性**
   - [ ] 各Phaseで何が起こるかが具体的に記載されている
   - [ ] 新規作成か既存ファイルの移動かが明確に区別されている

2. **用語の一貫性**
   - [ ] 同じ動作を指す場合は同じ用語を使用している
   - [ ] 曖昧な表現（「配置変更」等）を避けている

3. **タイムラインの整合性**
   - [ ] 異なるPhase間で矛盾する記述がない
   - [ ] ファイルの作成→移動→削除のフローが論理的である

4. **具体性**
   - [ ] ファイルパスが明示されている
   - [ ] 作業の内容が具体的に記載されている

## 実例での修正

### Before（問題のある記述）

```markdown
### Phase 2: 実装・単体テスト
- [ ] テスト戦略書の配置変更: `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`

### Phase 4: 旧コード削除
- [ ] 旧テスト戦略書の移動（`docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md` → `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`）
```

### After（明確な記述）

```markdown
### Phase 2: 実装・単体テスト
- [ ] テスト戦略書を新しい場所に作成: `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`

### Phase 4: 旧コード削除
- [ ] 旧テスト戦略書の削除（`docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md`）
  - 新しいテスト戦略書はPhase 2で作成済みのため、旧ファイルは単純削除
```

## 適用対象

このガイドラインは以下のドキュメントに適用される：

- `docs/user-stories/*/README.md`
- リファクタリングを含むUser Storyドキュメント
- テスト戦略書の移行を含む開発プロセスドキュメント

## 参考

- [path-consistency-guide.md](./path-consistency-guide.md) - パス参照の一貫性ルール
- [acceptance-criteria-guide.md](./acceptance-criteria-guide.md) - 受け入れ条件の記述ルール