# User Story 018: UseCase/Controller InputData 注入パターン統一（ImportRulesJsonInputData 活用）

## ストーリー

> UseCase および Controller が InputData DTO を通じて入力を受け取るパターンに統一することで、コードベースの一貫性を高め、テスト容易性を向上させたい

## 概要

`ImportRulesJsonInteractor`（UseCase）および `ImportRulesJsonController` は、現在 `jsonString: string` を直接受け取る設計となっており、`ImportRulesJsonInputData` DTO は使用されていない。

本ユーザーストーリーでは、他の UseCase/Controller と同様に `ImportRulesJsonInputData` を経由して入力を受け取るパターンへ統一し、コードベースの一貫性を向上させる。

## 背景

PR#394 レビュー（GitHub Copilot によるコメント、akAredminEogre 返信 id:2849726185）で指摘済み。
`ImportRulesJsonInputData` は将来のリファクタリングに備えて意図的に保持されているが、本 PR では UseCase/Controller の設計変更が必要なため見送り、本ユーザーストーリーとして明示した。

**該当ファイル**:
- `host-frontend-root/frontend-src-root/src/application-business-rules/dto/input/ImportRulesJsonInputData.ts`
- `host-frontend-root/frontend-src-root/src/application-business-rules/interactors/ImportRulesJsonInteractor.ts`
- `host-frontend-root/frontend-src-root/src/application-business-rules/ports/input/IImportRulesJsonUseCase.ts`
- `host-frontend-root/frontend-src-root/src/interface-adapters/controllers/ImportRulesJsonController.ts`

## 現状

### 現在の設計（直接 string 受け取り）

```typescript
// IImportRulesJsonUseCase.ts
interface IImportRulesJsonUseCase {
  previewImport(jsonString: string): Promise<void>;
  confirmImport(): Promise<void>;
}

// ImportRulesJsonController.ts
async execute(jsonString: string): Promise<void> {
  await this.useCase.previewImport(jsonString);
}
```

### 目標設計（InputData DTO 経由）

```typescript
// IImportRulesJsonUseCase.ts
interface IImportRulesJsonUseCase {
  previewImport(inputData: ImportRulesJsonInputData): Promise<void>;
  confirmImport(): Promise<void>;
}

// ImportRulesJsonController.ts
async execute(inputData: ImportRulesJsonInputData): Promise<void> {
  await this.useCase.previewImport(inputData);
}
```

### 課題

| 課題 | 詳細 |
|------|------|
| 一貫性欠如 | 他の UseCase/Controller は InputData DTO を経由しているが、ImportRulesJson は直接 string を受け取っている |
| テスト容易性 | InputData DTO を使うことで、テスト時に入力値の構造が明確になり、将来の拡張も容易になる |
| `ImportRulesJsonInputData` 未使用 | DTO が存在するにもかかわらず使用されておらず、コードの意図が不明瞭 |

## 開発戦略

### Phase 1: UseCase インターフェース変更

- [ ] `IImportRulesJsonUseCase.previewImport()` の引数を `ImportRulesJsonInputData` に変更
- [ ] `ImportRulesJsonInteractor.previewImport()` の実装を更新

### Phase 2: Controller 変更

- [ ] `IImportRulesJsonController.execute()` の引数を `ImportRulesJsonInputData` に変更
- [ ] `ImportRulesJsonController.execute()` の実装を更新
- [ ] `ImportRulesJsonControllerFactory` の更新（必要に応じて）

### Phase 3: UI 層の更新

- [ ] `useImportRulesJson.ts` など UI 層で InputData を生成してから Controller に渡すよう更新

### Phase 4: テスト整備

- [ ] 影響を受ける全クラスのユニットテスト更新
- [ ] E2E テスト通過確認

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
