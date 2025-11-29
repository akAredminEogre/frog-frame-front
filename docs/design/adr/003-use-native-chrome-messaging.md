# ADR-003: Chrome ネイティブメッセージングAPIの採用

**ステータス:** 採用  
**日付:** 2025-01-01  
**決定者:** 開発チーム

## コンテキスト

Chrome拡張機能における異なるコンテキスト間（Background、Content Script、Popup）のメッセージング方式を決定する必要があった。特に以下の要件を満たす必要があった:

1. **型安全性**: メッセージの送受信における型の保証
2. **ルーティング**: メッセージタイプに応じた適切な処理の振り分け
3. **非同期処理**: Promise/async-awaitベースの処理
4. **エラーハンドリング**: メッセージ送信失敗時の適切な処理
5. **保守性**: メッセージ定義の追加・変更の容易さ

## 検討した選択肢

### 選択肢1: @webext-core/messaging

**メリット:**
- 完全な型安全性（送信側と受信側で型が一致）
- シンプルなAPI（defineExtensionMessaging）
- 自動的なエラーハンドリング
- Promiseベースの非同期処理

**デメリット:**
- 外部ライブラリへの依存追加
- 学習コストの増加
- プロジェクトサイズの増加（約10KB）
- メッセージパターンが限定的

### 選択肢2: Plasmo Messaging API

**メリット:**
- Plasmoフレームワーク統合時は設定不要
- ファイルベースのルーティング
- 型安全性のサポート

**デメリット:**
- Plasmoフレームワーク全体の採用が前提
- 独自の規約に縛られる
- 他のフレームワークへの移行が困難

### 選択肢3: Chrome ネイティブAPI + カスタムルーター（現在の実装）

```typescript
// messageRouter.ts
export function createMessageRouter() {
  return async (request: MessageRequest): Promise<MessageResponse> => {
    switch (request.type) {
      case 'SAVE_RULE':
        return await handleSaveRule(request.payload);
      case 'LOAD_RULE':
        return await handleLoadRule(request.payload);
      default:
        throw new Error(`Unknown message type: ${request.type}`);
    }
  };
}

// 使用側
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    const response = await route(request);
    sendResponse(response);
  })();
  return true; // async response
});
```

**メリット:**
- **依存関係なし**: 外部ライブラリ不要
- **完全な制御**: メッセージング処理を完全にカスタマイズ可能
- **軽量**: 追加のバンドルサイズなし
- **柔軟性**: プロジェクト固有の要件に対応可能
- **Clean Architecture準拠**: Infrastructure層で適切にラップ可能

**デメリット:**
- 型安全性の手動実装が必要
- ボイラープレートコードの増加
- エラーハンドリングの手動実装

## 決定

**Chrome ネイティブAPI + カスタムルーターパターンを採用する。**

理由:
1. **外部依存の最小化**: コアとなるメッセージング機能に外部ライブラリを使用しない
2. **プロジェクト要件への適合**: カスタムルーターで必要十分な機能を実装
3. **保守性**: Chrome APIの仕様変更への直接対応が可能
4. **パフォーマンス**: 余分なオーバーヘッドがない
5. **学習コスト**: Chrome Extension標準のAPIを使用

## 影響

**ポジティブ:**
- バンドルサイズの最適化
- Chrome APIの全機能を活用可能
- デバッグが容易（Chrome DevToolsで直接確認）
- 将来的な拡張が容易

**ネガティブ:**
- 型定義の手動管理が必要
- ルーティングロジックの自前実装
- テストのモック作成が複雑

**リスク:**
- 型安全性の保証が開発者の実装に依存
- メッセージングパターンの統一性維持が課題
- 新規開発者の学習曲線

## 実装詳細

現在の実装構造:
```
src/infrastructure/browser/
├── router/
│   ├── background/
│   │   └── messageRouter.ts    # Background用ルーター
│   └── content/
│       └── messageRouter.ts     # Content Script用ルーター
└── background/
    └── runtime/
        └── onMessageReceived.ts # メッセージリスナー登録
```

型定義:
```typescript
// メッセージリクエストの型定義
interface MessageRequest {
  type: string;
  payload?: unknown;
}

// メッセージレスポンスの型定義
interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}
```

## 移行戦略

将来的に@webext-core/messagingへの移行が必要になった場合:
1. 現在のルーターインターフェースを維持
2. 内部実装のみを@webext-coreに置き換え
3. 段階的な移行が可能な設計

## 関連ドキュメント

- `src/infrastructure/browser/router/` - メッセージルーター実装
- `src/infrastructure/browser/background/runtime/onMessageReceived.ts` - メッセージリスナー
- `docs/design/01-architecture.md` - アーキテクチャ設計書
- `docs/design/08-constraints-matrix.md` - メッセージング制約