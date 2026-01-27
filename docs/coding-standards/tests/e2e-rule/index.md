# E2Eテストルール

E2Eテスト（Playwright）に適用されるルール。

## 目次

| ファイル | 内容 |
|---------|------|
| [selector-rules.md](./selector-rules.md) | 要素セレクタの優先順位、data-testid命名規則、getByRole厳密マッチ |
| [helper-organization.md](./helper-organization.md) | 共通定数・ヘルパーの2層構造、配置判断基準 |
| [assertion-rules.md](./assertion-rules.md) | 重複アサーション禁止、前提条件検証 |

## 概要

E2Eテストコードを書く際は、以下の観点でルールに従うこと：

1. **セレクタ選択**: テストの安定性を確保するため、`data-testid`を優先使用
2. **ヘルパー配置**: グローバル共通と機能固有の2層構造で整理
3. **アサーション**: ヘルパー関数との重複を避け、前提条件を明示的に検証
