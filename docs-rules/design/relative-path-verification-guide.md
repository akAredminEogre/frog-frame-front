# 設計ドキュメント相対パス検証ガイドライン

設計ドキュメント（`docs/design/`配下）内での相対パス参照の正確性を保つためのガイドライン。

## 基本原則

### 1. 相対パス計算の正確性

設計ドキュメントから他のドキュメントを参照する際は、正確な階層数を計算する。

### 2. 事前検証の必須化

相対パスリンクを記載する前に、必ず実際のファイル存在確認を行う。

### 3. 標準的な参照パターンの確立

よく使用される参照先に対しては、標準的なパスパターンを定義する。

## 階層計算ルール

### テスト戦略書からの標準的な参照

**テスト戦略書の典型的な位置**:
```text
docs/design/src/[layer]/[category]/[ClassName]/[methodName].md
```

**例**: `docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md`

#### 階層数の計算方法

1. **現在のファイル位置を確認**
   ```text
   docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase/execute.md
   ```

2. **階層を数える**
   ```text
   1. docs/ (最上位)
   2. design/
   3. src/
   4. application/
   5. usecases/
   6. rule/
   7. UpdateRewriteRuleUseCase/
   8. execute.md (現在位置)
   ```

3. **`docs/`までの段階数**
   - `execute.md` → `UpdateRewriteRuleUseCase/` → `rule/` → `usecases/` → `application/` → `src/` → `design/` → `docs/`
   - **7段階上がる必要** → `../../../../../../../`

### よくある参照先のパスパターン

#### A. コーディング規約への参照

```markdown
# 正しいパス（7段階上 + 対象パス）
[mock-file-placement.md](../../../../../../../coding-standards/tests/common-rule/mock-file-placement.md)

# 間違いやすいパターン（6段階のみ）
[mock-file-placement.md](../../../../../../coding-standards/tests/common-rule/mock-file-placement.md)
```

#### B. ADR（Architecture Decision Records）への参照

```markdown
# 正しいパス
[ADR-001](../../../../../../../adr/001-clean-architecture-with-presenter-pattern.md)
```

#### C. User Storyドキュメントへの参照

```markdown
# 正しいパス
[User Story 014](../../../../../../../user-stories/user-story-014/README.md)
```

## 検証手順

### 1. 手動検証

相対パスを記載する際の必須チェック手順：

```bash
# 1. 現在位置の確認
pwd
# 例: /home/user/project/docs/design/src/application/usecases/rule/UpdateRewriteRuleUseCase

# 2. 相対パスの動作確認
ls ../../../../../../../coding-standards/tests/common-rule/mock-file-placement.md

# 3. ファイルが存在することの確認
echo "ファイルが存在すれば OK"
```

### 2. パス構築の段階的確認

```bash
# 段階的にパスを構築して確認
ls ../../../../../../..  # docs/ まで戻れているか
ls ../../../../../../../coding-standards  # 目的のディレクトリが見えるか
ls ../../../../../../../coding-standards/tests/common-rule/mock-file-placement.md  # 最終ファイル
```

### 3. IDE/エディタでの確認

- VS Code等のエディタでリンクをCtrl+クリックして正しくファイルが開くか確認
- ファイルが存在しない場合は通常エラー表示される

## よくある間違いパターン

### パターン1: 階層数の計算ミス

```markdown
# 間違い（6段階しか上がっていない）
[mock-file-placement.md](../../../../../../coding-standards/tests/common-rule/mock-file-placement.md)

# 正しい（7段階上がる）
[mock-file-placement.md](../../../../../../../coding-standards/tests/common-rule/mock-file-placement.md)
```

### パターン2: 存在しないファイル名の参照

```markdown
# 間違い（存在しないファイル）
[basic-rule.md](../../../../../../../coding-standards/tests/common-rule/basic-rule.md)

# 正しい（実際に存在するファイル）
[mock-file-placement.md](../../../../../../../coding-standards/tests/common-rule/mock-file-placement.md)
```

### パターン3: ディレクトリ構造の変更に追従していない

```markdown
# 古いディレクトリ構造での参照
[common-rule.md](../../../../../../../coding-standards/tests/unit/common-rule.md)

# 新しいディレクトリ構造での参照
[mock-file-placement.md](../../../../../../../coding-standards/tests/common-rule/mock-file-placement.md)
```

## 予防策

### 1. テンプレートの活用

よく使用される参照パターンをテンプレート化する：

```markdown
<!-- テスト戦略書テンプレート内での標準参照 -->

> **重要**: モック作成は [mock-file-placement.md](../../../../../../../coding-standards/tests/common-rule/mock-file-placement.md) の「モック作成の分離ルール」に従うこと。

> **参照**: [mock-file-placement.md](../../../../../../../coding-standards/tests/common-rule/mock-file-placement.md) の「モック作成前の確認手順」
```

### 2. 自動化ツールの活用

```bash
# リンクチェックスクリプト（例）
find docs/design -name "*.md" -exec markdown-link-check {} \;
```

### 3. 作成時チェックリスト

設計ドキュメント作成・編集時の必須確認項目：

- [ ] 相対パスの階層数を正確に計算した
- [ ] 参照先ファイルの存在を確認した
- [ ] リンクが実際に機能することを確認した
- [ ] ファイル名・ディレクトリ名に誤字がないことを確認した

## トラブルシューティング

### リンクが機能しない場合の診断手順

1. **階層数の再計算**
   - 現在位置から`docs/`までの段階数を再度数え直す

2. **ファイル存在確認**
   ```bash
   # 絶対パスで確認
   ls docs/coding-standards/tests/common-rule/mock-file-placement.md
   ```

3. **ディレクトリ構造の確認**
   ```bash
   # 中間ディレクトリが存在するか確認
   ls -la docs/coding-standards/tests/common-rule/
   ```

4. **ファイル名の正確性確認**
   ```bash
   # 完全一致するファイルがあるか確認
   find docs/coding-standards -name "*mock-file*"
   ```

## 適用対象

このガイドラインは以下のドキュメントに適用される：

- `docs/design/src/**/*.md` - すべての設計ドキュメント
- `docs/design/pages/**/*.md` - ページレベル設計ドキュメント
- テスト戦略書での外部ドキュメント参照

## 関連ガイドライン

- [path-consistency-guide.md](../../user-stories/path-consistency-guide.md) - User Storyドキュメントでのパス整合性
- [test-strategy-migration-guide.md](../../user-stories/test-strategy-migration-guide.md) - テスト戦略書移行プロセス