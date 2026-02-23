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
│  │     - Controllerを呼び出す（ファイル選択後 / 確認後）                │ │
│  │     - Presenterからのプレビュー/成功/エラー通知を反映                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ui/components/organisms/ImportRulesJsonUI/ImportRulesJsonUI.tsx    │ │
│  │     - ImportButtonとプレビュー確認ダイアログを統合したUI             │ │
│  │     - プレビュー状態（currentCount / importCount）を表示            │ │
│  │     - [キャンセル] / [インポート実行] ボタンを提供                   │ │
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
│  │ - InputDataを生成         │    │ - PreviewDataを受け取る   │          │
│  │ - UseCaseを呼び出す       │    │ - OutputDataを受け取る    │          │
│  │ (2メソッド:               │    │ - エラーを通知            │          │
│  │   importRulesJson /      │    │ (3メソッド:               │          │
│  │   confirmImport)         │    │   presentPreview /       │          │
│  │                          │    │   present /              │          │
│  │                          │    │   presentError)          │          │
│  └────────────┬─────────────┘    └──────────▲───────────────┘          │
└───────────────┼──────────────────────────────┼──────────────────────────┘
                │ InputData                    │ OutputData / PreviewData
                ▼                              │
┌──────────────────────────────────────────────────────────────────────────┐
│                   application-business-rules/ (第2層)                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ interactors/rule/ImportRulesJsonInteractor                       │   │
│  │ ※ Rules Pageコンテキストで実行                                     │   │
│  │                                                                  │   │
│  │ Phase 1: importRulesJson(jsonString)                             │   │
│  │   - JSON.parse() → バリデーション                                 │   │
│  │   - getAll()でcurrentCount取得                                   │   │
│  │   - PreviewData生成 → Presenter.presentPreview()                 │   │
│  │                                                                  │   │
│  │ Phase 2: confirmImport()                                         │   │
│  │   - 全件 delete() × N回                                          │   │
│  │   - 新ルール create() × M回                                      │   │
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

## クラス一覧

### enterprise-business-rules (第1層)

| クラス | 責務 |
|--------|------|
| RewriteRule | ルールエンティティ。インポート対象のIDを含む全属性を保持（既存、変更なし） |

### application-business-rules (第2層)

| クラス | 責務 |
|--------|------|
| ImportRulesJsonInputData | 入力DTO。jsonString（ファイル読み取り文字列）を保持 |
| ImportRulesJsonPreviewOutputData | プレビューDTO。currentRuleCount / importRuleCountを保持 |
| ImportRulesJsonOutputData | 出力DTO。importedCount / previousCountを保持 |
| ImportRulesJsonErrorOutputData | エラー出力DTO。error / errorType ('parse'\|'validation'\|'storage') / messageを保持 |
| IImportRulesJsonUseCase | Input Port。インポート処理のインターフェース（2メソッド） |
| IImportRulesJsonPresenter | Output Port。結果通知のインターフェース（3メソッド） |
| ImportRulesJsonInteractor | UseCase実装。バリデーション→プレビュー通知→一括上書き→結果通知を実行 |
| IRewriteRuleRepository | Gateway Interface。ルール永続化（既存、変更なし。getAll/delete/createを使用） |

### interface-adapters (第3層)

| クラス | 責務 |
|--------|------|
| IImportRulesJsonController | Controllerのインターフェース。Factoryの戻り値型として使用（ADR-005参照） |
| ImportRulesJsonController | IImportRulesJsonControllerの実装。UseCaseを呼び出す |
| IImportRulesJsonControllerFactory | Controllerを生成するFactoryのインターフェース。ReactコールバックをPresenterに注入（ADR-005参照） |
| ImportRulesJsonControllerFactory | IImportRulesJsonControllerFactoryの実装 |
| ImportRulesJsonPresenter | PreviewData/OutputDataをViewに通知（プレビュー表示・成功通知・エラー通知） |
| RewriteRuleMapper | Entity ↔ DTO 変換（既存、変更なし） |
| IRewriteRuleMessagingPort | MessagingServiceの抽象化（既存、変更なし） |

### frameworks-and-drivers (第4層)

| クラス | 責務 |
|--------|------|
| ImportButton | UIコンポーネント。インポートボタン。disabled propで操作制御。hidden inputを内包 |
| UploadIcon | インポートボタン用アイコン（DownloadIconとの対） |
| ImportRulesJsonUI | Organism。ImportButton＋プレビュー確認ダイアログを統合 |
| ToastNotification | UIコンポーネント。トースト通知（既存） |
| RulesApp | View。ルール一覧画面。isImportingフラグでインポート中の重複実行を防止（既存、変更対象） |
| useImportRulesJson | カスタムフック。useMemoによるController初期化・isImporting/previewData状態管理・onPreview/onSuccess/onErrorコールバックを担う |

## アーキテクチャ補足

### 責務分離の原則

| コンポーネント | 責務 | 備考 |
|---------------|------|------|
| IRewriteRuleRepository | データ永続化のみ | 既存のgetAll/delete/createを使用。インターフェース変更なし |
| Interactor | ワークフロー調整 | バリデーション→プレビュー→全件削除→新規作成→Presenter通知 |
| Presenter | View通知のみ | onPreview/onSuccess/onErrorコールバック経由 |
| View (RulesApp) | ボタン状態管理 | isImportingによる重複防止 |
| Hook (useImportRulesJson) | 状態管理・ファイルI/O | FileReader、プレビュー状態、onPreview/onSuccess/onErrorコールバック |

### 2フェーズ制御フロー

インポートは2フェーズで実行される:

```text
Phase 1: ファイル選択→バリデーション→プレビュー
  ImportButton クリック
    → <input type="file"> 発火
    → FileReader.readAsText()
    → useImportRulesJson → Controller.importRulesJson(jsonString)
    → Interactor: JSON.parse() + バリデーション + getAll()
    → Presenter.presentPreview(previewData)
    → Hook(onPreview): プレビューダイアログ表示

Phase 2: ユーザー確認→実行
  [インポート実行] ボタンクリック
    → Controller.confirmImport()
    → Interactor: delete() × N + create() × M
    → Presenter.present(outputData)
    → Hook(onSuccess): 成功トースト + ルール一覧リフレッシュ
```

### Presenter設計（3コールバック）

ADR-005 Factoryパターン準拠。エクスポートの2コールバック（onSuccess/onError）に対し、
インポートはプレビューのためのコールバックを追加した3コールバック構成:

```typescript
interface IImportRulesJsonPresenter {
  presentPreview(preview: ImportRulesJsonPreviewOutputData): void;  // onPreview
  present(output: ImportRulesJsonOutputData): void;           // onSuccess
  presentError(error: ImportRulesJsonErrorOutputData): void;  // onError
}
```

### IRewriteRuleRepositoryインターフェース変更なし

インポート処理は既存メソッドのループで実現する（バルクAPI追加不要）:

```text
getAll()   → 全件ID取得（件数表示・削除対象特定）
delete(id) × N回 → 全件削除
create(rule) × M回 → 新ルール追加
```

Chrome拡張のルール件数規模（数百件程度）では性能問題なし。
影響範囲を最小化するためインターフェース変更を避ける。

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
| Presenterコールバック | onSuccess, onError | onPreview, onSuccess, onError |
| Repository操作 | getAll() | getAll(), delete(), create() |

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
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       application-business-rules/                           │
│                                                                             │
│  ┌─────────────────────────────┐    ┌──────────────────────────────────┐   │
│  │ <<interface>>               │    │ <<interface>>                    │   │
│  │ IImportRulesJsonUseCase     │    │ IImportRulesJsonPresenter        │   │
│  │ ─────────────────────────── │    │ ────────────────────────────────│   │
│  │ + importRulesJson(          │    │ + presentPreview(preview)       │   │
│  │     jsonString): void       │    │ + present(output)               │   │
│  │ + confirmImport(): void     │    │ + presentError(errorData)       │   │
│  └──────────▲──────────────────┘    └───────────▲──────────────────────┘   │
│             │                                   │                          │
│             │ implements                        │ uses                     │
│             │                                   │                          │
│  ┌──────────┴───────────────────────────────────┴───────────┐              │
│  │ ImportRulesJsonInteractor                                │              │
│  │ ──────────────────────────────────────────────────────── │              │
│  │ - repository: IRewriteRuleRepository                     │              │
│  │ - presenter: IImportRulesJsonPresenter                    │              │
│  │ - pendingRules: RewriteRule[] | null  ← Phase間保持       │              │
│  │ ──────────────────────────────────────────────────────── │              │
│  │ + importRulesJson(jsonString): Promise<void>             │              │
│  │ + confirmImport(): Promise<void>                         │              │
│  └──────────────────────────────────────────────────────────┘              │
│                                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────┐                   │
│  │ ImportRulesJson          │  │ ImportRulesJson       │                   │
│  │ InputData                │  │ PreviewOutputData     │                   │
│  │ ──────────────────────── │  │ ──────────────────── │                   │
│  │ + jsonString: string     │  │ + currentRuleCount:  │                   │
│  └──────────────────────────┘  │     number           │                   │
│                                │ + importRuleCount:   │                   │
│  ┌──────────────────────────┐  │     number           │                   │
│  │ ImportRulesJson          │  └──────────────────────┘                   │
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
│  │ + create(rule): Promise     │                                          │
│  │ + delete(id): Promise       │                                          │
│  └─────────────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          interface-adapters/                                │
│                                                                             │
│  ┌────────────────────────────────────┐  ┌────────────────────────────┐    │
│  │ <<interface>>                      │  │ <<interface>>              │    │
│  │ IImportRulesJsonControllerFactory  │  │ IImportRulesJsonController │    │
│  │ ────────────────────────────────── │  │ ────────────────────────── │    │
│  │ + create(onPreview,               │  │ + importRulesJson(         │    │
│  │   onSuccess,                      │  │     jsonString): void      │    │
│  │   onError): IImportRules...       │  │ + confirmImport(): void    │    │
│  └──────────▲─────────────────────────┘  └──────────▲─────────────────┘    │
│             │ implements                            │ implements           │
│  ┌──────────┴─────────────────────────┐  ┌──────────┴─────────────────┐    │
│  │ ImportRulesJsonControllerFactory   │  │ ImportRulesJsonController  │    │
│  │ ────────────────────────────────── │  │ ────────────────────────── │    │
│  │ - repository: IRewriteRule...      │  │ - useCase: IImportRules... │    │
│  │ ────────────────────────────────── │  │ ────────────────────────── │    │
│  │ + create(onPreview,               │  │ + importRulesJson(         │    │
│  │   onSuccess,                      │  │     jsonString): void      │    │
│  │   onError): IImportRules...       │  │ + confirmImport(): void    │    │
│  └────────────────────────────────────┘  └────────────────────────────┘    │
│                                                                             │
│                                          ┌────────────────────────────┐    │
│                                          │ ImportRulesJsonPresenter   │    │
│                                          │ ────────────────────────── │    │
│                                          │ - onPreview: Func          │    │
│                                          │ - onSuccess: Func          │    │
│                                          │ - showErrorInView: Func    │    │
│                                          │ ────────────────────────── │    │
│                                          │ + presentPreview(preview)  │    │
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
│  │ + onFileSelect: (           │    │ + onImportClick: () => void  │        │
│  │     file: File) => void     │    │ + onConfirm: () => void      │        │
│  │ + disabled?: boolean        │    │ + onCancel: () => void       │        │
│  │ (hidden <input type="file"> │    │ + isImporting: boolean       │        │
│  │  を内包)                    │    │ + previewData: PreviewData   │        │
│  └─────────────────────────────┘    │     | null                  │        │
│                                     └─────────────────────────────┘        │
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
