# ADR-005: tsyringeによる依存性注入の採用

**ステータス:** 採用  
**日付:** 2024-10-01  
**決定者:** 開発チーム

## コンテキスト

Clean Architectureの実装において、以下の要件を満たす依存性注入（DI）の仕組みが必要だった:

1. **依存性の逆転原則**: Application層のインターフェースをInfrastructure層で実装
2. **テスタビリティ**: モックオブジェクトの注入によるテスト容易性
3. **TypeScript対応**: 型安全な依存性注入
4. **Chrome拡張環境での動作**: Service Worker環境での制約考慮
5. **React統合**: Componentsからの利用

## 検討した選択肢

### 選択肢1: 手動DI（Poor Man's DI）

```typescript
class SaveRewriteRuleUseCase {
  constructor(
    private repository = new DexieRewriteRuleRepository(),
    private tabService = new ChromeTabsService()
  ) {}
}
```

**メリット:**
- シンプルで理解しやすい
- 外部ライブラリ不要
- デバッグが容易
- バンドルサイズ最小

**デメリット:**
- テスト時のモック注入が煩雑
- 依存関係の管理が手動
- シングルトン管理が困難
- 循環依存の検出が困難

### 選択肢2: InversifyJS

**メリット:**
- 成熟したDIコンテナ
- 豊富な機能（スコープ、タグ、名前付きバインディング等）
- 大規模プロジェクトでの実績
- 優れたドキュメント

**デメリット:**
- バンドルサイズが大きい（約45KB）
- 学習曲線が急
- デコレータの設定が複雑
- オーバーエンジニアリング傾向

### 選択肢3: tsyringe（採用）

**メリット:**
- **軽量**: 約20KBのバンドルサイズ
- **シンプルなAPI**: @injectable()と@inject()のみで基本機能実現
- **TypeScript親和性**: デコレータベースの型安全な実装
- **reflect-metadata統合**: 標準的なメタデータAPI使用
- **十分な機能**: シングルトン、トランジェント、スコープドライフサイクル対応

**デメリット:**
- InversifyJSより機能が限定的
- reflect-metadataが必要
- デコレータの実験的機能への依存

## 決定

**tsyringeを採用する。**

理由:
1. **バランスの良さ**: 必要十分な機能と軽量性の両立
2. **学習コスト**: シンプルなAPIで習得が容易
3. **Chrome拡張に最適**: Service Worker環境でも問題なく動作
4. **保守性**: Microsoftによるメンテナンス
5. **実装の簡潔性**: デコレータによる直感的な実装

## 実装詳細

### コンテナ設定（container.ts）

```typescript
import { container } from 'tsyringe';

// インターフェースと実装のバインディング
container.register('IRewriteRuleRepository', {
  useClass: DexieRewriteRuleRepository
});

container.register('IChromeTabsService', {
  useClass: ChromeTabsService
});
```

### UseCase実装

```typescript
@injectable()
export class SaveRewriteRuleUseCase {
  constructor(
    @inject('IRewriteRuleRepository')
    private repository: IRewriteRuleRepository,
    @inject('IChromeTabsService')
    private tabService: IChromeTabsService
  ) {}
}
```

### テストでのモック注入

```typescript
beforeEach(() => {
  container.clearInstances();
  container.register('IRewriteRuleRepository', {
    useValue: mockRepository
  });
});
```

## 影響

**ポジティブ:**
- 依存関係の一元管理
- テストでのモック注入が容易
- シングルトンパターンの自動管理
- 循環依存の検出

**ネガティブ:**
- reflect-metadataによるバンドルサイズ増加（約5KB）
- デコレータ構文の学習が必要
- ビルド設定の複雑化（experimentalDecorators有効化）

**リスク:**
- デコレータ仕様の将来的な変更
- reflect-metadataの保守終了リスク
- 過度な抽象化による複雑性

## 移行戦略

将来的に他のDIソリューションへの移行が必要な場合:
1. インターフェース定義は維持
2. container.tsのみを変更
3. デコレータを段階的に置き換え

## 設定要件

### tsconfig.json

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### エントリーポイント

```typescript
import 'reflect-metadata'; // 最初にインポート
import { container } from './infrastructure/di/container';
```

## 関連ドキュメント

- `src/infrastructure/di/container.ts` - DIコンテナ設定
- `docs/design/01-architecture.md` - アーキテクチャ設計書
- [tsyringe公式ドキュメント](https://github.com/microsoft/tsyringe)