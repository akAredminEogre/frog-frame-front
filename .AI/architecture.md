# アーキテクチャ概要

→ アーキテクチャ設計決定の詳細は [docs/design/adr/001-use-wxt-framework.md](../docs/design/adr/001-use-wxt-framework.md) を参照


## アーキテクチャルール

→ アーキテクチャルール詳細は [`.clinerules/01-coding-standards.md`](../.clinerules/01-coding-standards.md) を参照

## 依存性注入

- **コンテナ**: `src/infrastructure/di/container.ts`
- **パターン**: インターフェースと具体的な実装を登録
- アプリケーション層の全依存関係はコンストラクタ経由で `@inject()` デコレータを使って注入
- デコレータのメタデータには `reflect-metadata` を使用
