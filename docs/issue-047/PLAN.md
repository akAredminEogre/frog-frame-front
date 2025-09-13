# issue-047実装計画: App.tsxのDI改善

## 概要

App.tsxのDI（依存性注入）を改善し、手動でのインスタンス化をDIコンテナベースに移行する。

## 現状分析

### 課題
1. **App.tsx内での依存関係組み立て**: Presentation層で具体的な実装クラスを直接インスタンス化
2. **DIコンテナの未活用**: 既存のcontainer.tsが十分に活用されていない
3. **テストの困難さ**: 依存関係が固定化されているためモックが困難

## 実装計画

### Step 1: DIコンテナの拡張
- `container.ts`にSaveRewriteRuleAndApplyToCurrentTabUseCaseを登録
- App.tsx用のファクトリメソッド追加

### Step 2: App.tsxのリファクタリング
```typescript
// 変更前 (現在)
const repository = new ChromeStorageRewriteRuleRepository();
const currentTabService = new ChromeCurrentTabService();
const chromeRuntimeService = new ChromeRuntimeService();
const saveUseCase = new SaveRewriteRuleAndApplyToCurrentTabUseCase(
  repository,
  currentTabService,
  chromeRuntimeService
);

// 変更後 (目標)
const saveUseCase = container.getSaveRewriteRuleAndApplyToCurrentTabUseCase();
```

### Step 3: テストコード整備
- infrastructure層のテストコード作成（ISSUE.mdのタスクより）
- Application層のテストコード作成
- モックを使用したテスト

## 技術的考慮事項

### DIパターンの実装レベル
- 現在の手動DIから、containerベースのDIに移行
- 複雑なDIフレームワークは導入せず、シンプルなファクトリパターンを維持

### Chrome Extension APIの制約
- manifest v3の制約を考慮
- service workerとcontent scriptの通信制限

### TypeScript型安全性
- 全ての変更でTypeScript完全準拠を維持
- 型定義の充実化

## 受け入れ条件の確認方法

- [ ] `docker compose exec frontend npm run unused:safe`が成功すること
- [ ] 既存機能が正常に動作すること
- [ ] 新しいテストがすべてパスすること
- [ ] ESLintエラーが発生しないこと

## リスク軽減策

### 1. 段階的リファクタリング
- 一度にすべてを変更せず、小さな単位で進める
- 各ステップで動作確認を実施

### 2. 既存機能の保護
- 変更前に現在の動作を記録
- 回帰テストの実施

### 3. 型安全性の維持
- TypeScriptの型チェックを活用
- 型定義の充実

## 成功指標

1. **コード品質**: 依存関係が適切に分離されている
2. **テスタビリティ**: モックを使用したテストが容易
3. **保守性**: 新機能の追加が容易
4. **性能**: 通信フローの最適化による応答性向上

## 完了基準

- [ ] App.tsxから具体的な実装クラスの直接インスタンス化を除去
- [ ] DIコンテナを通じた依存関係の管理
- [ ] infrastructure層のテストカバレッジ80%以上
- [ ] 既存機能の完全な動作確認
- [ ] ドキュメント更新（必要に応じて）
