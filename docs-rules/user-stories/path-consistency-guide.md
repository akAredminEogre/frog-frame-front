# パス整合性ガイドライン

User Story ドキュメント内でのファイルパス参照の一貫性を保つためのガイドライン。

## 基本原則

### 1. 現状優先の原則

- **現在存在するファイル**のパスを記載する
- 将来の移動予定がある場合は、現在のパスと移行先パスを明確に区別する
- 存在しないパスを記載してはならない

### 2. 統一性の原則

- 同一ファイルを指す場合は、すべてのドキュメント間で同一のパス表記を使用する
- README.md と acceptance-criteria.md 間でパス表記に矛盾があってはならない

## パス参照のルール

### A. 移行予定がない場合

現在存在するファイルパスをそのまま記載する。

```markdown
# 良い例
- [テスト戦略書](../../design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md)

# 悪い例（存在しないパス）
- [テスト戦略書](../../design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md)
```

### B. 移行予定がある場合

現在のパスと移行先パスを明確に区別して記載する。

#### README.md での記載方法

```markdown
# 良い例（リンクは現在のパス、説明で移行予定を明記）
- [テスト戦略書](../../design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md) - 現行のテスト戦略書（リファクタリング後に配置変更）

# または詳細説明付き
- [テスト戦略書](../../design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md)
  - 現在: `docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md`
  - 移行先: `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`
```

#### acceptance-criteria.md での記載方法

受け入れ条件では移行作業自体を条件として記載する。

```markdown
# 良い例（現在と移行先を明記）
- [ ] テスト戦略書が新しい配置に移動されている
  - 現在: `docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md`
  - 移行先: `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`

# 悪い例（移行先のパスのみ記載）
- [ ] テスト戦略書が新しい配置に移動されている
  - `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`
```

## 検証手順

### ドキュメント作成・更新時のチェックリスト

1. **パス存在確認**
   - 参照しているファイルパスが実際に存在することを確認
   - `ls` コマンドや IDE のファイルブラウザで確認する

2. **パス一貫性確認**
   - 同一ユーザーストーリー内のすべてのドキュメントで同じファイルのパス表記が一致しているか確認
   - README.md と acceptance-criteria.md を突き合わせて確認

3. **移行計画の明確化**
   - ファイルの移行予定がある場合、現在のパスと移行先パスを明確に区別
   - 移行のタイミング（Phase や条件）を明記

### 問題発見時の対応手順

1. **現在存在するファイルパスを基準とする**
   - 実在するファイルの場所を正として記載を修正
   - 存在しないパスは削除または修正

2. **移行予定がある場合の表記統一**
   - 現在のパスと移行先パスを明確に分離
   - 移行のタイミングを具体的に記載

3. **関連ドキュメントの一括確認**
   - 同じファイルを参照している他のドキュメントも確認
   - プロジェクト全体での整合性を保つ

## よくある問題パターン

### パターン 1: 移行先パスのみ記載

**問題**: 現在存在しないパスを記載している

```markdown
# 問題のある記載
- [ ] テスト戦略書が新しい配置に移動されている
  - `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`
```

**修正**: 現在のパスも含めて記載

```markdown
# 修正後
- [ ] テスト戦略書が新しい配置に移動されている
  - 現在: `docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md`
  - 移行先: `docs/design/src/application-business-rules/interactors/UpdateRewriteRuleInteractor/execute.md`
```

### パターン 2: ドキュメント間でパス表記が異なる

**問題**: README.md と acceptance-criteria.md で異なるパスを参照

**対策**: より具体的で現状に忠実な表記に統一する

### パターン 3: 曖昧な移行タイミング

**問題**: 「リファクタリング後」など曖昧な表現

**対策**: 具体的な Phase や条件を記載する

```markdown
# 曖昧な表現
リファクタリング後に配置変更

# 具体的な表現
Phase 4: 旧コード削除時に移動
```

## 適用対象

このガイドラインは以下のドキュメントに適用される：

- `docs/user-stories/*/README.md`
- `docs/user-stories/*/acceptance-criteria.md`
- User Story 関連のその他のドキュメント

## 参考

- [acceptance-criteria-guide.md](./acceptance-criteria-guide.md) - 受け入れ条件の記述ルール
- [readme-guide.md](./readme-guide.md) - User Story README の記述ルール