# アーキテクチャ概要

→ アーキテクチャ設計決定の詳細は [docs/design/adr/001-use-wxt-framework.md](../docs/design/adr/001-use-wxt-framework.md) を参照

## プロジェクト構成

```
frog-frame-front/
├── host-frontend-root/
│   └── frontend-src-root/    # フロントエンドソースコード
│       ├── src/              # アプリケーションコード
│       ├── tests/            # テストコード
│       └── wxt.config.ts
├── docs/                     # ドキュメント
├── CLAUDE.md
└── Makefile
```

## Clean Architectureレイヤー構成（src/）

```
src/
├── entrypoints/              # WXTエントリーポイント
│   ├── background.ts
│   ├── content.ts
│   ├── popup/
│   ├── rules/
│   └── edit/
├── components/               # Reactコンポーネント（Atomic Design）
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── pages/
├── application/              # アプリケーション層（ユースケース）
│   ├── usecases/
│   ├── ports/
│   └── types/
├── domain/                   # ドメイン層（ビジネスロジック）
│   ├── entities/
│   ├── value-objects/
│   ├── constants/
│   └── errors/
├── infrastructure/           # インフラストラクチャ層
│   ├── browser/              # Chrome APIラッパー
│   ├── persistence/          # ストレージサービス
│   ├── windows/              # ウィンドウ管理
│   └── di/                   # 依存性注入コンテナ
└── utils/

tests/
├── unit/                     # Vitestユニットテスト
│   ├── domain/
│   ├── application/
│   └── infrastructure/
└── e2e/                      # Playwright E2Eテスト
```

## アーキテクチャルール

→ アーキテクチャルール詳細は [`.clinerules/01-coding-standards.md`](../.clinerules/01-coding-standards.md) を参照

## 依存性注入

- **コンテナ**: `src/infrastructure/di/container.ts`
- **パターン**: インターフェースと具体的な実装を登録
- アプリケーション層の全依存関係はコンストラクタ経由で `@inject()` デコレータを使って注入
- デコレータのメタデータには `reflect-metadata` を使用
