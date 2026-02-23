# ディレクトリ構造設計

## 詳細構造

### 第1層: enterprise-business-rules/

```text
src/enterprise-business-rules/
└── entities/                                    ← Entity
    └── RewriteRule/
        └── RewriteRule.ts                       ← 既存、変更なし
```

### 第2層: application-business-rules/

```text
src/application-business-rules/
├── ports/
│   ├── input/                                   ← Input Port (Interface)
│   │   └── IImportRulesJsonUseCase.ts           ← NEW
│   ├── output/                                  ← Output Port (Interface)
│   │   └── IImportRulesJsonPresenter.ts         ← NEW
│   └── gateway/                                 ← Gateway Interface (Interactorが依存)
│       └── IRewriteRuleRepository.ts            ← 既存、変更なし(getAll/create/deleteを使用)
├── interactors/                                 ← Use Case Interactor
│   └── ImportRulesJsonInteractor.ts             ← NEW
└── dto/                                         ← Data Transfer Objects
    ├── input/
    │   └── ImportRulesJsonInputData.ts           ← NEW
    └── output/
        ├── ImportRulesJsonPreviewOutputData.ts          ← NEW (プレビュー確認ダイアログ用)
        ├── ImportRulesJsonOutputData.ts           ← NEW
        └── ImportRulesJsonErrorOutputData.ts      ← NEW
```

### 第3層: interface-adapters/

```text
src/interface-adapters/
├── controllers/                                 ← Controller
│   ├── IImportRulesJsonController.ts            ← NEW (Controllerインターフェース, ADR-005参照)
│   └── ImportRulesJsonController.ts             ← NEW
├── presenters/                                  ← Presenter
│   └── ImportRulesJsonPresenter.ts              ← NEW
├── factories/                                   ← Factory(ADR-005参照)
│   ├── IImportRulesJsonControllerFactory.ts     ← NEW (Factoryインターフェース, ADR-005参照)
│   └── ImportRulesJsonControllerFactory.ts      ← NEW (Factory実装, ADR-005参照)
├── ports/                                       ← Port(Mapperが依存, ADR-002参照)
│   └── IRewriteRuleMessagingPort.ts             ← 既存、変更なし
└── mappers/                                     ← Mapper(ADR-002、ADR-003参照)
    └── RewriteRuleMapper.ts                     ← 既存、変更なし
```

### 第4層: frameworks-and-drivers/

```text
src/frameworks-and-drivers/
├── ui/                                          ← View (React)
│   ├── components/
│   │   ├── atoms/
│   │   │   └── ImportButton/                    ← NEW (Atomコンポーネント)
│   │   │       ├── ImportButton.tsx             ← NEW (hidden inputを内包)
│   │   │       ├── ImportButton.module.css      ← NEW (Atomはカプセル化・再利用性のためCSSモジュール採用)
│   │   │       └── UploadIcon.tsx               ← NEW (DownloadIconとの対)
│   │   └── organisms/
│   │       └── ImportRulesJsonUI/               ← NEW (Organismコンポーネント)
│   │           └── ImportRulesJsonUI.tsx        ← NEW (ImportButton + 確認ダイアログ統合; ダイアログオーバーレイはpropsによる動的レイアウトのためインラインスタイル採用)
│   ├── hooks/                                   ← React Custom Hooks
│   │   └── useImportRulesJson.ts               ← NEW
│   └── pages/
│       └── rules/
│           └── RulesApp.tsx                     ← 既存、ImportRulesJsonUI統合
├── persistence/                                 ← Repository 実装
│   ├── indexeddb/
│   │   └── DexieRewriteRuleRepository.ts        ← 既存、変更なし
│   └── ChromeRuntimeRewriteRuleRepository.ts    ← 既存、変更なし
├── messaging/                                   ← メッセージング層(ADR-002参照)
│   ├── RewriteRuleMessagingService.ts           ← 既存、変更なし
│   ├── RewriteRuleProxyService.ts               ← 既存、変更なし
│   ├── RewriteRuleProxyServiceImpl.ts           ← 既存、変更なし
│   └── dto/                                     ← メッセージング用DTO(ADR-002、ADR-003参照)
│       └── RewriteRuleDTO.ts                    ← 既存、変更なし
└── di/                                          ← DI Container
    └── container.ts                             ← 既存、ImportRulesJsonControllerFactory登録追加
```

## 新規ファイル一覧

| ファイル | 層 | 概要 |
|---------|------|------|
| `src/application-business-rules/ports/input/IImportRulesJsonUseCase.ts` | 第2層 | UseCase Input Port インターフェース |
| `src/application-business-rules/ports/output/IImportRulesJsonPresenter.ts` | 第2層 | Presenter Output Port インターフェース |
| `src/application-business-rules/interactors/ImportRulesJsonInteractor.ts` | 第2層 | UseCaseの実装。バリデーション・プレビュー・一括上書き |
| `src/application-business-rules/dto/input/ImportRulesJsonInputData.ts` | 第2層 | 入力DTO（jsonString） |
| `src/application-business-rules/dto/output/ImportRulesJsonPreviewOutputData.ts` | 第2層 | プレビューDTO（currentRuleCount / importRuleCount） |
| `src/application-business-rules/dto/output/ImportRulesJsonOutputData.ts` | 第2層 | 出力DTO（importedCount / previousCount） |
| `src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData.ts` | 第2層 | エラーDTO（error / errorType / message） |
| `src/interface-adapters/controllers/IImportRulesJsonController.ts` | 第3層 | Controller インターフェース（ADR-005） |
| `src/interface-adapters/controllers/ImportRulesJsonController.ts` | 第3層 | Controller 実装 |
| `src/interface-adapters/factories/IImportRulesJsonControllerFactory.ts` | 第3層 | Factory インターフェース（ADR-005） |
| `src/interface-adapters/factories/ImportRulesJsonControllerFactory.ts` | 第3層 | Factory 実装 |
| `src/interface-adapters/presenters/ImportRulesJsonPresenter.ts` | 第3層 | Presenter 実装（3コールバック） |
| `src/frameworks-and-drivers/ui/components/atoms/ImportButton/ImportButton.tsx` | 第4層 | インポートボタンUIコンポーネント |
| `src/frameworks-and-drivers/ui/components/atoms/ImportButton/ImportButton.module.css` | 第4層 | インポートボタンスタイル |
| `src/frameworks-and-drivers/ui/components/atoms/ImportButton/UploadIcon.tsx` | 第4層 | アップロードアイコン（DownloadIconと対） |
| `src/frameworks-and-drivers/ui/components/organisms/ImportRulesJsonUI/ImportRulesJsonUI.tsx` | 第4層 | ImportButton + 確認ダイアログ統合Organism |
| `src/frameworks-and-drivers/ui/hooks/useImportRulesJson.ts` | 第4層 | カスタムHook（状態管理・ファイルI/O） |

## 既存修正ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `src/frameworks-and-drivers/ui/pages/rules/RulesApp.tsx` | ImportRulesJsonUI コンポーネントを統合。isImportingフラグ追加 |
| `src/frameworks-and-drivers/di/container.ts` | ImportRulesJsonControllerFactory を DI コンテナに登録 |
