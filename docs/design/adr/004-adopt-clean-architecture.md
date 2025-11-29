# ADR-004: Clean Architectureの採用

**ステータス:** 採用  
**日付:** 2024-10-01  
**決定者:** 開発チーム

## コンテキスト

Chrome拡張機能プロジェクトにおいて、以下の課題に対応するアーキテクチャパターンが必要だった:

1. **テスタビリティ**: Chrome Extension APIに依存しない単体テストの実現
2. **保守性**: ビジネスロジックとインフラストラクチャの分離
3. **拡張性**: 新機能追加時の既存コードへの影響最小化
4. **チーム開発**: 責務の明確化による並行開発の実現
5. **Chrome API制約への対応**: 実行コンテキスト別の制約を考慮した設計

## 検討した選択肢

### 選択肢1: MVCパターン

**メリット:**
- シンプルで理解しやすい
- 多くの開発者が経験済み
- 実装が高速

**デメリット:**
- Chrome拡張の実行コンテキスト分離に適さない
- ビジネスロジックがControllerに集中しがち
- Chrome APIへの依存が散在

### 選択肢2: Fluxアーキテクチャ

**メリット:**
- 単一方向データフロー
- 状態管理が明確
- React との親和性が高い

**デメリット:**
- Background Service Workerとの統合が複雑
- オーバーエンジニアリングになりやすい
- Chrome Extension特有の制約との不整合

### 選択肢3: Clean Architecture（採用）

**メリット:**
- **依存性の逆転**: ビジネスロジックが外部に依存しない
- **テスタビリティ**: 各層を独立してテスト可能
- **Chrome API分離**: Infrastructure層でChrome APIをラップ
- **責務の明確化**: 4層構造による明確な責任分離
- **DDD適用可能**: Domain層でビジネスロジックを表現

**デメリット:**
- 初期学習コストが高い
- ボイラープレートコードの増加
- 小規模プロジェクトではオーバーエンジニアリング

## 決定

**Clean Architectureを採用する。**

理由:
1. **Chrome Extension特有の制約への対応**: 実行コンテキスト毎の制約を層で吸収
2. **長期的な保守性**: ビジネスロジックの独立性確保
3. **テスト戦略の明確化**: 各層で異なるテスト方針を適用可能
4. **チーム開発の効率化**: 層別の並行開発が可能
5. **技術的負債の最小化**: 変更の影響範囲を層内に限定

## 実装詳細

### 4層構造

1. **Domain層**
   - 責務: ビジネスルールの定義
   - 依存: なし
   - 例: RewriteRule、DomDiffer

2. **Application層**
   - 責務: ユースケースの実装
   - 依存: Domain層のみ
   - 例: SaveRewriteRuleUseCase

3. **Infrastructure層**
   - 責務: 外部サービスとの接続
   - 依存: Application層のインターフェース実装
   - 例: DexieRewriteRuleRepository、ChromeTabsService

4. **Presentation層**
   - 責務: UIコンポーネント
   - 依存: Application層のUseCase
   - 例: React Components、WXT entrypoints

### 依存性ルール

```
Presentation → Application → Domain
     ↓              ↓
Infrastructure → Application (interface実装)
```

## 影響

**ポジティブ:**
- Chrome APIモックによる高速な単体テスト
- ビジネスロジックの再利用性向上
- 新機能追加時の影響範囲限定
- コードレビューの効率化（層別レビュー）

**ネガティブ:**
- ファイル数・ディレクトリ数の増加
- 初期実装コストの増大
- 新規メンバーのオンボーディング期間延長

**リスク:**
- 過度な抽象化による複雑性
- パフォーマンスオーバーヘッド
- Clean Architecture原則からの逸脱

## 成功指標

- Domain層のテストカバレッジ: 90%以上
- Chrome API依存コードのInfrastructure層への隔離: 100%
- UseCase単位での機能追加・変更の実現

## 関連ドキュメント

- `docs/design/01-architecture.md` - アーキテクチャ詳細設計書
- `docs/design/00-overview.md` - プロジェクト概要
- Robert C. Martin "Clean Architecture" (書籍)