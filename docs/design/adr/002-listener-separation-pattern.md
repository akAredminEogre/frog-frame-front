# ADR-002: リスナー分離パターンとComposition Root

**ステータス:** 採用  
**日付:** 2025-01-01  
**決定者:** 開発チーム

## コンテキスト

Chrome拡張機能のBackground Service Workerにおいて、イベントリスナーの管理方法を決定する必要があった。特に以下の課題への対応が求められた:

1. **リスナー登録の整理**: chrome.tabs、chrome.runtime、chrome.contextMenus等の複数のAPIリスナーの管理
2. **責務の分離**: 各リスナーの処理を独立したモジュールとして管理
3. **テスタビリティ**: 各リスナーの単体テストを容易にする
4. **依存性管理**: Clean ArchitectureにおけるDIコンテナとの統合
5. **保守性**: リスナー追加・削除時の影響範囲の最小化

## 検討した選択肢

### 選択肢1: 単一ファイルでの集中管理

```typescript
// background.ts に全てのリスナーを記述
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 処理
});
chrome.runtime.onInstalled.addListener((details) => {
  // 処理
});
// ... 全てのリスナー
```

**メリット:**
- シンプルで直感的
- リスナー全体を一箇所で把握可能
- 初期実装が高速

**デメリット:**
- ファイルが肥大化する
- テストが困難（全リスナーが結合される）
- 責務の分離ができない
- チーム開発時にコンフリクトが発生しやすい

### 選択肢2: クラスベースのリスナー管理

```typescript
class BackgroundService {
  constructor(private container: Container) {}
  
  registerListeners() {
    this.registerTabListeners();
    this.registerRuntimeListeners();
  }
  
  private registerTabListeners() {
    chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
  }
}
```

**メリット:**
- オブジェクト指向的なアプローチ
- 状態管理が容易
- DIパターンとの親和性

**デメリット:**
- 不要なステートフルな設計
- thisバインディングの複雑性
- Chrome拡張のステートレスな性質と不一致

### 選択肢3: Composition Rootパターン（現在の実装）

```typescript
// background.ts (Composition Root)
export default defineBackground({
  type: 'module',
  main() {
    tabsOnUpdated();
    runtimeOnExtensionInstalled();
    runtimeOnMessageReceived();
    contextMenusOnClicked();
  },
});

// 各リスナーは独立したモジュール
// infrastructure/browser/background/tabs/onUpdated.ts
export function tabsOnUpdated() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 処理
  });
}
```

**メリット:**
- **責務の明確な分離**: 各リスナーが独立したモジュール
- **テスタビリティ向上**: 各リスナーを独立してテスト可能
- **保守性向上**: リスナー追加・削除が他に影響しない
- **Clean Architecture準拠**: Infrastructure層での適切な配置
- **型安全性**: 各リスナーのシグネチャが明確

**デメリット:**
- ファイル数の増加
- ディレクトリ構造の複雑化
- 初期学習コストの増加

## 決定

**Composition Rootパターンを採用する。**

理由:
1. **Clean Architecture原則への準拠**: Infrastructure層で外部API（Chrome Extension API）を適切にラップ
2. **単一責任の原則**: 各リスナーが単一の責務を持つ
3. **テスト容易性**: 各リスナーの処理を独立してモック・テスト可能
4. **スケーラビリティ**: 新しいリスナー追加時も既存コードへの影響がない
5. **可読性**: background.tsを見れば登録されているリスナーが一目瞭然

## 影響

**ポジティブ:**
- リスナー処理の見通しが良くなる
- 単体テストの記述が容易
- チーム開発でのコンフリクト減少
- リスナー間の独立性確保
- デバッグが容易（各リスナーを個別に追跡可能）

**ネガティブ:**
- ファイル数増加による管理コスト
- 初期実装時のボイラープレート増加
- ディレクトリ構造の学習コスト

**リスク:**
- 過度な分離による複雑性の増加
- リスナー間でのデータ共有が必要な場合の対応
- 新規開発者のオンボーディングコスト

## 実装詳細

現在の実装構造:
```
src/infrastructure/browser/background/
├── contextMenus/
│   └── onClicked.ts
├── runtime/
│   ├── onExtensionInstalled.ts
│   └── onMessageReceived.ts
└── tabs/
    └── onUpdated.ts
```

各リスナーは以下の規約に従う:
- 関数名は `{API名}On{イベント名}` の形式
- exportされた単一の関数として実装
- Chrome APIの呼び出しはInfrastructure層内で完結
- ビジネスロジックはUseCase経由で実行

## 関連ドキュメント

- `src/entrypoints/background.ts` - Composition Root実装
- `docs/design/01-architecture.md` - アーキテクチャ設計書
- `docs/design/08-constraints-matrix.md` - Chrome拡張制約マトリックス