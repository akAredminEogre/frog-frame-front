# E2Eテストルール

E2Eテスト（Playwright）に適用されるルール。

## 目次

| ファイル | 内容 |
|---------|------|
| [naming-rules.md](./naming-rules.md) | テスト名は検証内容を正確に記述、曖昧表現の回避 |
| [selector-rules.md](./selector-rules.md) | 要素セレクタの優先順位、data-testid命名規則、ヘルパー更新、行スコープ |
| [helper-organization.md](./helper-organization.md) | 共通定数・ヘルパーの2層構造、配置判断基準 |
| [assertion-rules.md](./assertion-rules.md) | 重複アサーション禁止、前提条件検証 |
| [interaction-rules.md](./interaction-rules.md) | click()とdispatchEvent()の使い分け、連続クリックテスト |
| [text-extraction-rules.md](./text-extraction-rules.md) | textContent()のtrim()正規化、innerText()との違い |

## 概要

E2Eテストコードを書く際は、以下の観点でルールに従うこと：

1. **テスト命名**: 検証内容を正確に記述し、曖昧な表現を避ける
2. **セレクタ選択**: テストの安定性を確保するため、`data-testid`を優先使用
3. **ヘルパー配置**: グローバル共通と機能固有の2層構造で整理
4. **アサーション**: ヘルパー関数との重複を避け、前提条件を明示的に検証
5. **インタラクション**: 連続クリックテストには`dispatchEvent`を使用
6. **テキスト取得**: `textContent()`は`trim()`で正規化

## ルール適用の一貫性

**重要**: 新しいルールを追加した場合、**同じPR内の全コードにそのルールを適用すること**。

### 理由

- ルールを追加しても、同じPR内のコードが従っていないと矛盾が生じる
- レビュアーが「自分で追加したルールに違反している」と指摘することになる

### チェックリスト

新しいルールをドキュメントに追加したら：

- [ ] **違反パターンを検索**: 新ルールに違反するコードパターンをgrepで検索
  - 例: 行スコープルール追加時 → `grep -r "\.nth\|\.first()" tests/e2e/` で全箇所を確認
- [ ] 同じPR内で追加・変更したコードが新ルールに従っているか確認
- [ ] ヘルパー関数とテストコードの両方でルールを適用しているか確認
- [ ] コメントで新ルールへの準拠を明記（例：「selector-rules.md セクション5準拠」）
