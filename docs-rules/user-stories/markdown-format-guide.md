# Markdownフォーマットガイドライン

User Storyドキュメント作成時のMarkdownフォーマット規則。markdownlint準拠。

## 基本ルール

### 1. セクションタイトルはヘッディングを使用（MD036対応）

**規則**: セクション区切りには強調表記（`**タイトル**`）ではなく、適切なヘッディング記号（`#`）を使用する。

#### 悪い例（MD036違反）

```markdown
### Phase 1: 実装フェーズ

**第1層: Domain Layer**
- [ ] エンティティの実装

**第2層: Application Layer**
- [ ] UseCaseの実装
```

#### 良い例（MD036準拠）

```markdown
### Phase 1: 実装フェーズ

#### 第1層: Domain Layer
- [ ] エンティティの実装

#### 第2層: Application Layer
- [ ] UseCaseの実装
```

### 2. ヘッディングレベルの適切な選択

#### Phase配下のセクション分け

- **Phase**: `###`（レベル3）
- **Layer/Category**: `####`（レベル4）

```markdown
## 開発戦略

### Phase 1: 設計フェーズ

#### 第1層: Domain Layer
- [ ] 設計ドキュメント作成

#### 第2層: Application Layer
- [ ] インターフェース設計

### Phase 2: 実装フェーズ

#### 第1層: Domain Layer
- [ ] エンティティ実装
```

### 3. 強調表記の適切な使用

強調表記（`**text**`）はセクションタイトルではなく、以下の用途でのみ使用する：

- **重要な単語やフレーズの強調**
- **変更内容**: リネーム、移動など
- **影響ファイル数**: 少数、大量など

```markdown
# 良い例
- **変更内容**: `src/application/usecases/` → `src/application-business-rules/interactors/` へ移動
- **影響ファイル数**: 少数

# 悪い例（セクションタイトルに強調表記を使用）
**影響ファイル**
- 少数のファイルが影響を受ける
```

## よくある問題パターン

### パターン 1: Phase内のサブセクション

**問題**: Phaseの配下で`**サブセクション**`を使用

```markdown
# 問題のある書き方
### Phase 1: 実装

**第1層: Domain**
- [ ] エンティティ実装

**第2層: Application**
- [ ] UseCase実装
```

**修正**: `####`を使用

```markdown
# 正しい書き方
### Phase 1: 実装

#### 第1層: Domain
- [ ] エンティティ実装

#### 第2層: Application
- [ ] UseCase実装
```

### パターン 2: 階層の混在

**問題**: ヘッディングと強調表記が混在

```markdown
# 問題のある書き方
### Phase 1: 実装

#### 第1層: Domain
- [ ] エンティティ実装

**テスト戦略書**
- [ ] テスト戦略書の作成
```

**修正**: 同一レベルは統一

```markdown
# 正しい書き方
### Phase 1: 実装

#### 第1層: Domain
- [ ] エンティティ実装

#### テスト戦略書
- [ ] テスト戦略書の作成
```

### パターン 3: カテゴリ分けでの強調表記

**問題**: ファイル分類やカテゴリで`**カテゴリ名**`を使用

```markdown
# 問題のある書き方
**新規作成ファイル**
| ファイル | 説明 |
|---------|------|
| Foo.ts  | 新規作成 |

**修正対象ファイル**
| ファイル | 説明 |
|---------|------|
| Bar.ts  | 修正が必要 |
```

**修正**: ヘッディングを使用

```markdown
# 正しい書き方
#### 新規作成ファイル
| ファイル | 説明 |
|---------|------|
| Foo.ts  | 新規作成 |

#### 修正対象ファイル
| ファイル | 説明 |
|---------|------|
| Bar.ts  | 修正が必要 |
```

## チェック手順

### 作成・編集時のセルフチェック

1. **強調表記の確認**
   - `**text**`がセクションタイトルとして使われていないか
   - セクション区切りには`####`等を使っているか

2. **ヘッディングレベルの確認**
   - Phaseは`###`（レベル3）
   - Phase内のカテゴリは`####`（レベル4）
   - 階層が一貫しているか

3. **markdownlint実行**
   ```bash
   # ファイル固有のチェック
   npx markdownlint docs/user-stories/user-story-XXX/README.md
   
   # 全ファイルチェック
   npx markdownlint docs/user-stories/**/*.md
   ```

### 自動チェックの活用

プロジェクトの markdownlint 設定（`.markdownlint.json`）に従い、以下のルールが自動適用される：

- **MD036**: 強調表記をヘッディングに使用禁止
- **MD001**: ヘッディングレベルの段階的増加
- **MD003**: ヘッディング記号の統一

## 修正例

### 実際のUser Story READMEの修正例

```markdown
# 修正前（MD036違反）
### Phase 1: Skeleton（インターフェース・スケルトンクラス作成）

**第2層: application-business-rules**
- [ ] インターフェース作成

**第3層: interface-adapters**
- [ ] Controller作成

**設計ドキュメント（docs/design/pages）**
- [ ] 設計ドキュメント作成

**テスト戦略書**
- [ ] テスト戦略書作成
```

```markdown
# 修正後（MD036準拠）
### Phase 1: Skeleton（インターフェース・スケルトンクラス作成）

#### 第2層: application-business-rules
- [ ] インターフェース作成

#### 第3層: interface-adapters
- [ ] Controller作成

#### 設計ドキュメント（docs/design/pages）
- [ ] 設計ドキュメント作成

#### テスト戦略書
- [ ] テスト戦略書作成
```

## 適用対象

このガイドラインは以下のドキュメントに適用される：

- `docs/user-stories/*/README.md`
- `docs/user-stories/*/acceptance-criteria.md`
- User Story関連のその他のMarkdownドキュメント

## 参考

- [markdownlint](https://github.com/DavidAnson/markdownlint) - Markdown linting tool
- [MD036 rule](https://github.com/DavidAnson/markdownlint/blob/main/doc/md036.md) - Emphasis used instead of a heading
- [path-consistency-guide.md](./path-consistency-guide.md) - パス整合性ガイドライン