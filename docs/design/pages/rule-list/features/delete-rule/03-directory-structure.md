# ディレクトリ構造設計

## 詳細構造

### 第1層: enterprise-business-rules/

```
src/enterprise-business-rules/
└── entities/                                    ← Entity
    └── RewriteRule/
        └── RewriteRule.ts                       ← matchesUrl() 使用（既存）
```

### 第2層: application-business-rules/

```
src/application-business-rules/
├── ports/
│   ├── input/                                   ← Input Port (Interface)
│   │   └── IDeleteRuleUseCase.ts                ← 新規
│   ├── output/                                  ← Output Port (Interface)
│   │   └── IDeleteRulePresenter.ts              ← 新規
│   └── gateway/                                 ← Gateway Interface（Interactorが依存）
│       ├── IRewriteRuleRepository.ts            ← 既存、delete()メソッド追加
│       └── ITabsGateway.ts                      ← 既存
├── interactors/                                 ← Use Case Interactor
│   └── DeleteRuleInteractor.ts                  ← 新規
└── dto/                                         ← Data Transfer Objects
    ├── input/
    │   └── DeleteRuleInputData.ts               ← 新規
    └── output/
        └── DeleteRuleOutputData.ts              ← 新規
```

### 第3層: interface-adapters/

```
src/interface-adapters/
├── controllers/                                 ← Controller
│   └── DeleteRuleController.ts                  ← 新規
├── presenters/                                  ← Presenter
│   └── DeleteRulePresenter.ts                   ← 新規
├── ports/                                       ← Port（Mapperが依存、ADR-002参照）
│   └── IRewriteRuleMessagingPort.ts             ← 既存、delete()メソッド追加
└── mappers/                                     ← Mapper（ADR-002、ADR-003参照）
    └── RewriteRuleMapper.ts                     ← 既存、delete()メソッド追加
```

### 第4層: frameworks-and-drivers/

```
src/frameworks-and-drivers/
├── ui/                                          ← View (React)
│   ├── components/
│   │   ├── atoms/
│   │   │   └── DeleteButton/                    ← 新規
│   │   │       └── DeleteButton.tsx
│   │   └── molecules/
│   │       ├── ConfirmDialog/                   ← 新規
│   │       │   └── ConfirmDialog.tsx
│   │       ├── ToastNotification/               ← 新規（または既存を使用）
│   │       │   └── ToastNotification.tsx
│   │       └── RuleTableRow/
│   │           └── RuleTableRow.tsx             ← 既存、DeleteButton追加
│   └── pages/
│       └── rules/
│           └── RulesApp.tsx                     ← 既存、変更対象
├── persistence/                                 ← Repository 実装
│   ├── indexeddb/
│   │   └── DexieRewriteRuleRepository.ts        ← 既存、delete()追加
│   └── ChromeRuntimeRewriteRuleRepository.ts    ← 既存、delete()追加
├── messaging/                                   ← メッセージング層
│   ├── RewriteRuleProxyService.ts               ← 既存、delete()追加
│   ├── RewriteRuleMessagingService.ts           ← 既存、delete()追加
│   └── dto/                                     ← メッセージング用DTO（ADR-002、ADR-003参照）
│       └── request-dto/                         ← リクエストDTO
│           └── DeleteRuleRequestDTO.ts          ← 新規 { id }
├── browser/                                     ← ブラウザ操作 Gateway 実装
│   └── ChromeTabsGateway.ts                     ← 既存
└── di/                                          ← DI Container
    └── container.ts                             ← 既存、変更対象
```

## 新規作成ファイル一覧

| 層 | ファイル | 責務 |
|----|---------|------|
| 第2層 | `IDeleteRuleUseCase.ts` | Input Port インターフェース |
| 第2層 | `IDeleteRulePresenter.ts` | Output Port インターフェース |
| 第2層 | `DeleteRuleInteractor.ts` | UseCase 実装 |
| 第2層 | `DeleteRuleInputData.ts` | 入力DTO |
| 第2層 | `DeleteRuleOutputData.ts` | 出力DTO |
| 第3層 | `DeleteRuleController.ts` | Controller |
| 第3層 | `DeleteRulePresenter.ts` | Presenter |
| 第4層 | `DeleteButton.tsx` | ゴミ箱アイコンボタン |
| 第4層 | `ConfirmDialog.tsx` | 確認ダイアログ |
| 第4層 | `ToastNotification.tsx` | トースト通知（既存があれば再利用） |
| 第4層 | `DeleteRuleRequestDTO.ts` | 削除リクエストDTO |

## 既存ファイル変更一覧

| 層 | ファイル | 変更内容 |
|----|---------|---------|
| 第2層 | `IRewriteRuleRepository.ts` | `delete(id: number): Promise<void>` 追加 |
| 第3層 | `IRewriteRuleMessagingPort.ts` | `delete(dto): Promise<void>` 追加 |
| 第3層 | `RewriteRuleMapper.ts` | `delete()` メソッド追加 |
| 第4層 | `DexieRewriteRuleRepository.ts` | `delete()` 実装追加 |
| 第4層 | `ChromeRuntimeRewriteRuleRepository.ts` | `delete()` 実装追加 |
| 第4層 | `RewriteRuleProxyService.ts` | `delete()` 追加 |
| 第4層 | `RewriteRuleMessagingService.ts` | `delete()` 追加 |
| 第4層 | `RuleTableRow.tsx` | DeleteButton 追加 |
| 第4層 | `RulesApp.tsx` | 削除ハンドラ、ConfirmDialog、Toast追加 |
| 第4層 | `container.ts` | DeleteRule関連の依存性登録 |
