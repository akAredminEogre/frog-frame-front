# クラス設計

## 制御フロー

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                     frameworks-and-drivers/ (第4層)                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ui/pages/rules/RulesApp.tsx (View)                                 │ │
│  │     - インポートボタンクリックを受け取る                              │ │
│  │     - ルール0件時もボタンを表示（EmptyState対応）                    │ │
│  │     - isImportingフラグで重複実行を防止                              │ │
│  │     - Controllerを呼び出す（ファイル選択後）                         │ │
│  │     - Presenterからの成功/エラー通知を反映                           │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ui/components/organisms/ImportRulesJsonUI/ImportRulesJsonUI.tsx    │ │
│  │     - ImportButtonを内包したOrganismコンポーネント                   │ │
│  │     - isImporting/importError/importSuccessをpropsで受け取る         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ui/components/atoms/ImportButton/ImportButton.tsx                  │ │
│  │     - アップロードアイコン付きボタンを表示                            │ │
│  │     - disabled時(インポート中)はグレーアウト                         │ │
│  │     - クリックで hidden <input type="file"> を発火                  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     interface-adapters/ (第3層)                          │
│  ┌──────────────────────────┐    ┌──────────────────────────┐          │
│  │ controllers/rule/        │    │ presenters/rule/         │          │
│  │ ImportRulesJson          │    │ ImportRulesJson          │          │
│  │ Controller               │    │ Presenter                │          │
│  │                          │    │                          │          │
│  │ - FileオブジェクトをInput │    │ - OutputDataを受け取る    │          │
│  │   Dataに変換し渡す        │    │ - エラーを通知            │          │
│  │ (1メソッド:               │    │ (2メソッド:               │          │
│  │   importRulesJson)       │    │   present /              │          │
│  │                          │    │   presentError)          │          │
│  └────────────┬─────────────┘    └──────────▲───────────────┘          │
└───────────────┼──────────────────────────────┼──────────────────────────┘
                │ ImportRulesJsonInputData      │ OutputData / PreviewData
                │ (file: File)
                ▼                              │
┌──────────────────────────────────────────────────────────────────────────┐
│                   application-business-rules/ (第2層)                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ interactors/rule/ImportRulesJsonInteractor                       │   │
│  │ ※ Rules Pageコンテキストで実行（1フェーズ）                         │   │
│  │                                                                  │   │
│  │ importRulesJson(inputData)                                       │   │
│  │   - new ImportFileSize(file.size) でサイズチェック                │   │
│  │   - jsonParser.parse() → バリデーション                           │   │
│  │   - getAll()でpreviousCount取得                                   │   │
│  │   - replaceAll(validatedRules) で原子的置換                       │   │
│  │   - OutputData生成 → Presenter.present()                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    enterprise-business-rules/ (第1層)                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ entities/RewriteRule/RewriteRule.ts                               │   │
│  │                                                                  │   │
│  │ - インポート対象のルールエンティティ                                 │   │
│  │ - IDを含む全属性（IDはJSONから引き継ぐかDB自動採番）                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

## クラス一覧（src配下のプロダクションコード）

本セクションではsrc配下の新規実装クラスを層別に記載します。E2Eテスト関連のクラスは含まれません。

### enterprise-business-rules (第1層)

| クラス | 責務 |
|--------|------|
| RewriteRule | ルールエンティティ。インポート対象のIDを含む全属性を保持（既存、変更なし） |
| ImportFileSize | ファイルサイズのValue Object。`MAX_IMPORT_FILE_SIZE_BYTES`（5MB）を保持し、`validateOrThrow()`でサイズ上限を検証する。違反時は `ImportFileSizeError` を送出する。ファイルサイズ上限はドメインルールのためEBR層に配置 |

### application-business-rules (第2層)

| クラス | 責務 |
|--------|------|
| ImportRulesJsonInputData | 入力DTO。file（Fileオブジェクト）を保持。frameworks-and-drivers層からCA準拠で注入 |
| ImportRulesJsonOutputData | 出力DTO。importedCount / previousCountを保持 |
| ImportRulesJsonErrorOutputData | エラー出力DTO。error / errorType ('parse'\|'validation'\|'storage') / messageを保持 |
| IImportRulesJsonPresenter | Output Port。結果通知のインターフェース（2メソッド） |
| IJsonParser | Service Port。JSON解析のインターフェース。CA準拠でInteractorがJSON.parseに直接依存しないよう抽象化 |
| IFileTextReader | Service Port。ファイルテキスト読み取りのインターフェース。CA準拠でFileReader APIへの依存をF&D層に限定 |
| IFileSizeValidator | Service Port。ファイルサイズ検証のインターフェース。CA準拠でFile.size APIへの依存をF&D層に限定 |
| IByteSizeCalculator | Service Port。バイトサイズ計算のインターフェース。CA準拠でBlob APIへの依存をF&D層に限定 |
| ImportRulesJsonInteractor | UseCase実装。バリデーション→一括上書き→結果通知を1フェーズで実行 |
| IRewriteRuleRepository | Gateway Interface。ルール永続化（replaceAllメソッドを追加。getAll/replaceAllを使用） |

### interface-adapters (第3層)

| クラス | 責務 |
|--------|------|
| IImportRulesJsonController | Controllerのインターフェース。Factoryの戻り値型として使用（ADR-005参照） |
| ImportRulesJsonController | IImportRulesJsonControllerの実装。UseCaseを呼び出す |
| IImportRulesJsonControllerFactory | Controllerを生成するFactoryのインターフェース。ReactコールバックをPresenterに注入（ADR-005参照） |
| ImportRulesJsonControllerFactory | IImportRulesJsonControllerFactoryの実装 |
| ImportRulesJsonPresenter | OutputDataをViewに通知（成功通知・エラー通知） |
| RewriteRuleMapper | Entity ↔ DTO 変換（既存、変更なし） |
| IRewriteRuleMessagingPort | MessagingServiceの抽象化（既存、変更なし） |

### frameworks-and-drivers (第4層)

| クラス | 責務 |
|--------|------|
| ImportButton | UIコンポーネント。インポートボタン。disabled propで操作制御。hidden inputを内包 |
| UploadIcon | インポートボタン用アイコン（DownloadIconとの対） |
| ImportRulesJsonUI | Organism。ImportButtonを内包。isImporting/importError/importSuccessをpropsで受け取る |
| ToastNotification | UIコンポーネント。トースト通知（既存） |
| RulesApp | View。ルール一覧画面。isImportingフラグでインポート中の重複実行を防止（既存、変更対象） |
| useImportRulesJson | カスタムフック。useMemoによるController初期化・isImporting/importError/importSuccess状態管理・onSuccess/onErrorコールバックを担う。ファイルはFileオブジェクトのままControllerへ渡す（FileSizeValidator/FileTextReader/BlobByteSizeCalculatorはInteractor層で使用） |
| JsonParser | IJsonParserの実装。JSON.parseをラップしCA準拠でフレームワーク依存をこの層に閉じ込める（`frameworks-and-drivers/Json/JsonParser.ts`） |
| FileTextReader | IFileTextReaderの実装。FileReader.readAsTextをラップしCA準拠でブラウザAPI依存をこの層に閉じ込める（`frameworks-and-drivers/File/FileTextReader.ts`） |
| FileSizeValidator | IFileSizeValidatorの実装。File.sizeチェックをラップしCA準拠でブラウザAPI依存をこの層に閉じ込める（`frameworks-and-drivers/File/FileSizeValidator.ts`） |
| BlobByteSizeCalculator | IByteSizeCalculatorの実装。Blob APIによるバイト計算をラップしCA準拠でブラウザAPI依存をこの層に閉じ込める（`frameworks-and-drivers/File/BlobByteSizeCalculator.ts`） |

## アーキテクチャ補足

### 責務分離の原則

| コンポーネント | 責務 | 備考 |
|---------------|------|------|
| IRewriteRuleRepository | データ永続化のみ | replaceAll（原子的置換）を使用。インターフェース変更あり（replaceAll追加） |
| Interactor | ワークフロー調整 | バリデーション→プレビュー→全件削除→新規作成→Presenter通知 |
| Presenter | View通知のみ | onPreview/onSuccess/showErrorInViewコールバック経由 |
| View (RulesApp) | ボタン状態管理 | isImportingによる重複防止 |
| Hook (useImportRulesJson) | 状態管理・ファイルI/O | FileReader、isImporting/importError/importSuccess状態管理 |

### 1フェーズ制御フロー

インポートはファイル選択から完了まで1フェーズで実行される（プレビュー確認なし）:

```text
Phase 1: ファイル選択→バリデーション→一括置換
  ImportButton クリック
    → <input type="file"> 発火
    → Controller.importRulesJson(file)
    → Interactor: new ImportFileSize(file.size) でサイズチェック + FileReader.readAsText() + jsonParser.parse() + バリデーション
    → Interactor: getAll()でpreviousCount取得 + replaceAll(validatedRules) による原子的一括置換
    → Presenter.present(outputData)
    → Hook(onSuccess): 成功トースト + ルール一覧リフレッシュ
```

### Presenter設計（2コールバック）

ADR-005 Factoryパターン準拠。エクスポートと同様の2コールバック構成（プレビュー廃止により整合）:

```typescript
interface IImportRulesJsonPresenter {
  present(output: ImportRulesJsonOutputData): void;           // onSuccess
  presentError(error: ImportRulesJsonErrorOutputData): void;  // onError
}
```

### IRewriteRuleRepositoryインターフェース変更あり（replaceAll追加）

インポート処理はreplaceAllによる原子的置換で実現する:

```text
getAll()          → 全件取得（previousCount算出用）
replaceAll(rules) → 全件原子的置換（トランザクション保護付き）
```

Chrome拡張のルール件数規模での一貫性を保証するため、delete/createループの代わりにトランザクション保護付きのreplaceAllを採用。

### エラーハンドリングの責務配置

| 層 | 責務 |
|----|------|
| Interactor | バリデーション失敗・Storage例外をキャッチし、ImportRulesJsonErrorOutputDataを作成してPresenterに渡す |
| Presenter | ErrorOutputDataをViewに通知 |
| View | トースト通知でユーザーに表示 |

### エラーメッセージ設計

| エラー種別 | errorType | 表示メッセージ |
|-----------|----------|---------------|
| JSON構文エラー | 'parse' | 「不正なJSONファイルです」 |
| スキーマ不正 | 'validation' | 「JSONスキーマが不正です（versionとrulesが必要です）」 |
| バージョン不一致 | 'validation' | 「未対応のバージョンです: X.X」 |
| ルール必須フィールド欠落 | 'validation' | 「ルール #N: oldStringが欠落しています」 |
| ルール0件 | 'validation' | 「インポートするルールがありません」 |
| ファイルサイズ超過 | 'validation' | 「ファイルサイズが上限（5MB）を超えています」 |
| ルール件数超過 | 'validation' | 「ルール件数が上限（1000件）を超えています」 |
| Storage操作失敗 | 'storage' | 「インポート処理中にエラーが発生しました: {error.message}」 |

### エクスポート機能との対称性

| 観点 | エクスポート（PR#393） | インポート（本機能） |
|------|----------------------|-------------------|
| ボタン名 | エクスポート | インポート |
| アイコン | DownloadIcon | UploadIcon |
| Atom | ExportButton | ImportButton |
| Hook | useExportRulesJson | useImportRulesJson |
| Controller | ExportRulesJsonController | ImportRulesJsonController |
| Interactor | ExportRulesJsonInteractor | ImportRulesJsonInteractor |
| Presenterコールバック | onSuccess, onError | onSuccess, onError |
| Repository操作 | getAll() | getAll(), replaceAll() |

## クラス図

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       enterprise-business-rules/                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RewriteRule                                                         │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ + id: number                                                        │   │
│  │ + oldString: string                                                 │   │
│  │ + newString: string                                                 │   │
│  │ + urlPattern: string                                                │   │
│  │ + isRegex: boolean                                                  │   │
│  │ + isActive: boolean                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ImportFileSize  (value-objects/ImportFileSize.ts)                   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ - byteSize: number                                                  │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ + isExceedingLimit(): boolean                                       │   │
│  │ [const] MAX_IMPORT_FILE_SIZE_BYTES = 5 * 1024 * 1024               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       application-business-rules/                           │
│                                                                             │
│  ┌──────────────────────┐                                                   │
│  │ ImportRulesJson       │                                                   │
│  │ InputData             │                                                   │
│  │ ──────────────────── │                                                   │
│  │ + file: File          │                                                   │
│  └──────────────────────┘                                                   │
│                                                                             │
│  ┌─────────────────────────────┐    ┌──────────────────────────────────┐   │
│  │ <<interface>>               │    │ <<interface>>                    │   │
│  │ IImportRulesJsonPresenter   │    │                                  │   │
│  │ ────────────────────────────│    │                                  │   │
│  │ + present(output)           │    │                                  │   │
│  │ + presentError(errorData)   │    │                                  │   │
│  └──────────▲──────────────────┘    └───────────▲──────────────────────┘   │
│             │                                   │                          │
│             │ implements                        │ uses                     │
│             │                                   │                          │
│  ┌──────────┴───────────────────────────────────┴───────────┐              │
│  │ ImportRulesJsonInteractor                                │              │
│  │ ──────────────────────────────────────────────────────── │              │
│  │ - repository: IRewriteRuleRepository                     │              │
│  │ - presenter: IImportRulesJsonPresenter                    │              │
│  │ - jsonParser: IJsonParser                                │              │
│  │ - fileTextReader: IFileTextReader                        │              │
│  │ ──────────────────────────────────────────────────────── │              │
│  │ + importRulesJson(inputData): Promise<void>              │              │
│  └──────────────────────────────────────────────────────────┘              │
│                                                                             │
│  ┌──────────────────────┐                                                   │
│  │ ImportRulesJson       │                                                   │
│  │ PreviewOutputData     │                                                   │
│  │ ──────────────────── │                                                   │
│  │ + currentRuleCount:  │                                                   │
│  │     number           │                                                   │
│  │ + importRuleCount:   │                                                   │
│  │     number           │                                                   │
│  └──────────────────────┘                                                   │
│                                                                             │
│  ┌──────────────────────────┐                                               │
│  │ ImportRulesJson          │                                               │
│  │ OutputData               │                                             │
│  │ ──────────────────────── │  ┌──────────────────────────────────────┐   │
│  │ + importedCount: number  │  │ ImportRulesJsonErrorOutputData       │   │
│  │ + previousCount: number  │  │ ────────────────────────────────── │   │
│  └──────────────────────────┘  │ + error: unknown                     │   │
│                                │ + errorType: 'parse'|'validation'|   │   │
│  ┌─────────────────────────────┐  │              'storage'            │   │
│  │ <<interface>>               │  │ + message: string (getter)        │   │
│  │ IRewriteRuleRepository      │  └──────────────────────────────────┘   │
│  │ ─────────────────────────── │                                          │
│  │ + getAll(): Promise<Rules>  │                                          │
│  │ + replaceAll(rules):Promise │                                          │
│  └─────────────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          interface-adapters/                                │
│                                                                             │
│  ┌────────────────────────────────────┐  ┌────────────────────────────┐    │
│  │ <<interface>>                      │  │ <<interface>>              │    │
│  │ IImportRulesJsonControllerFactory  │  │ IImportRulesJsonController │    │
│  │ ────────────────────────────────── │  │ ────────────────────────── │    │
│  │ + create(onSuccess,               │  │ + importRulesJson(         │    │
│  │   onError): IImportRules...       │  │   file: File): void        │    │
│  └──────────▲─────────────────────────┘  └──────────▲─────────────────┘    │
│             │ implements                            │ implements           │
│  ┌──────────┴─────────────────────────┐  ┌──────────┴─────────────────┐    │
│  │ ImportRulesJsonControllerFactory   │  │ ImportRulesJsonController  │    │
│  │ ────────────────────────────────── │  │ ────────────────────────── │    │
│  │ - repository: IRewriteRule...      │  │ - useCase: IImportRules... │    │
│  │ ────────────────────────────────── │  │ ────────────────────────── │    │
│  │ + create(onSuccess,               │  │ + importRulesJson(         │    │
│  │   onError): IImportRules...       │  │   file: File): void        │    │
│  └────────────────────────────────────┘  └────────────────────────────┘    │
│                                                                             │
│                                          ┌────────────────────────────┐    │
│                                          │ ImportRulesJsonPresenter   │    │
│                                          │ ────────────────────────── │    │
│                                          │ - onSuccess: Func          │    │
│                                          │ - onError: Func            │    │
│                                          │ ────────────────────────── │    │
│                                          │ + present(outputData)      │    │
│                                          │ + presentError(errorData)  │    │
│                                          └────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          frameworks-and-drivers/                            │
│                                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │ ImportButton                │    │ ImportRulesJsonUI            │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ + onFileSelect: (           │    │ + onFileSelect: (f) => void  │        │
│  │     file: File) => void     │    │ + isImporting: boolean       │        │
│  │ + disabled?: boolean        │    │ + importError: string|null   │        │
│  │ (hidden <input type="file"> │    │ + importSuccess: string|null │        │
│  │  を内包)                    │    │                              │        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │ UploadIcon                  │    │ ToastNotification           │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ (SVGアイコンコンポーネント)   │    │ + message: string           │        │
│  └─────────────────────────────┘    │ + type: 'error' | ...       │        │
│                                     │ + isVisible: boolean        │        │
│                                     └─────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 影響ドキュメント

- [ルール一覧 UI設計](../../ui.md) - インポートボタンの追加

## 関連ドキュメント

- [ルールJSONエクスポート機能](../export-rules-json/) - 対称機能
- [ルール削除機能](../delete-rule/) - 先行機能(同様のアーキテクチャ)
- [ADR-001: Clean Architecture with Presenter Pattern](../../../../../adr/001-clean-architecture-with-presenter-pattern.md)
- [ADR-002: メッセージングに @webext-core を採用](../../../../../adr/002-messaging-with-webext-core.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](../../../../../adr/003-unified-db-access-via-messaging.md)
- [ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン採用](../../../../../adr/005-factory-pattern-for-react-callback-injection.md)
