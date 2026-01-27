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
