3.1. プロジェクト構造のマッピング
コードの肥大化を防ぎ、関心事を明確に分離するためには、物理的なファイル構造がアーキテクチャを反映していることが重要です。`wxt.config.ts`で`srcDir: 'src'`を設定し、  
`src`ディレクトリ以下にレイヤーごとのフォルダを配置することを強く推奨します。

### 提案するディレクトリ構造

以下に、クリーンアーキテクチャとDDDを適用したWXTプロジェクトの推奨ディレクトリ構造を示します。ValueObjectを格納するための`value-objects`ディレクトリをdomain層に追加しています。

```
.
├── .wxt/
├── node_modules/
├── public/
├── src/
│   ├── application/
│   │   └── usecases/
│   │       └── note/
│   │           └── SaveNoteUseCase.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Note.ts
│   │   ├── value-objects/  <-- ValueObjectを配置
│   │   │   ├── NoteText.ts
│   │   │   └── PageUrl.ts
│   │   └── repositories/
│   │       └── INoteRepository.ts
│   ├── infrastructure/
│   │   ├── di/
│   │   │   └── container.ts
│   │   ├── persistence/
│   │   │   └── BrowserStorageNoteRepository.ts
│   │   └── messaging/
│   │       └── bridge.ts
│   ├── presentation/
│   │   ├── components/  (WXT auto-import)
│   │   │   └── NoteEditor.vue
│   │   └── entrypoints/ (WXT entrypoints)
│   │       ├── background.ts
│   │       ├── popup/
│   │       │   ├── index.html
│   │       │   └── main.ts
│   │       └── content/
│   │           └── index.ts
│   └── shared/
│       ├── tokens.ts
│       └── utils/       (WXT auto-import)
├── package.json
├── tsconfig.json
└── wxt.config.ts
```

この構造は、抽象的なアーキテクチャの概念を、開発者が日々触れる具体的なファイル配置に落とし込むための青写真となります。コードが整理されていないという問題に直面している開発者にとって、このような規範的な構造はリファクタリングへの明確な道筋を示します。

### レイヤーごとの対応表

| レイヤー（概念）         | ディレクトリ（物理）                                 | 責務と依存関係                                                                 | ファイル例                                 |
|--------------------------|------------------------------------------------------|-------------------------------------------------------------------------------|--------------------------------------------|
| Domain                   | `src/domain/`                                        | ビジネスの核となるルール、エンティティ、値オブジェクト、リポジトリのインターフェースを定義。外部依存なし。 | Note.ts, PageUrl.ts, INoteRepository.ts    |
| Application              | `src/application/`                                   | アプリケーション固有のユースケースを実装。Domain層にのみ依存。                | SaveNoteUseCase.ts                         |
| Interface Adapters       | `src/presentation/`, `src/infrastructure/`           | 内側と外側のレイヤーを接続。UIコンポーネント、リポジトリ実装、メッセージングブリッジなど。Application層とDomain層に依存。 | NoteEditor.vue, BrowserStorageNoteRepository.ts, bridge.ts |
| Frameworks & Drivers     | Project Root, `src/presentation/entrypoints/`, `src/infrastructure/di/` | フレームワークやドライバ、DI設定、エントリポイントなど。                       | wxt.config.ts, container.ts, background.ts |

