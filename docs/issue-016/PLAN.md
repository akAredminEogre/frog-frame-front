# issue-016 実装計画: window.getSelection()の抽象化

## 背景

現在、`ElementSelector.ts`で直接`window.getSelection()`を呼び出しており、テスト容易性に課題がある。`ElementSelector.test.ts`では複雑なモック設定（`(window.getSelection as any)`）が必要で、テスト容易性を向上させるため抽象化が必要。

## 目標

- `window.getSelection()`の記述を1箇所に集約
- `src/infrastructure/`ディレクトリに配置
- `ElementSelector.test.ts`の`window.getSelection as any`の記述を削除
- 既存のvitest、playwrightテストがすべて通ること

## 実装アプローチ

about-window-selection.mdの提案に従い、シンプルなラッパー関数による抽象化を行う。

### 1. インフラストラクチャ層にSelection Service作成

**ファイル**: `src/infrastructure/selection/SelectionService.ts`

```typescript
/**
 * ブラウザのSelection API を抽象化するサービス
 * テスト容易性向上のためwindow.getSelection()の呼び出しを集約
 */
export class SelectionService {
  /**
   * 現在のブラウザの選択範囲を取得
   * @returns Selection オブジェクト、または null
   */
  public getSelection(): Selection | null {
    return window.getSelection();
  }
}
```

### 2. ElementSelectorクラスの依存性注入対応

**変更対象**: `src/domain/entities/ElementSelector.ts`

- コンストラクタにSelectionServiceを受け取るよう修正
- `window.getSelection()`の直接呼び出しを`selectionService.getSelection()`に変更

### 3. テストファイルの改善

**変更対象**: `src/domain/entities/__tests__/ElementSelector.test.ts`

- `window.getSelection as any`のモック設定を削除
- SelectionServiceのモックを使用するよう変更
- 既存のテストケースはすべて保持

## 実装手順

### Phase 1: Infrastructure層の作成

1. `src/infrastructure/selection/`ディレクトリ作成
2. `SelectionService.ts`作成
3. インデックスファイル作成（必要に応じて）

### Phase 2: ElementSelectorクラスの修正

1. SelectionServiceを依存として受け取るよう修正
2. 既存のpublic APIは変更せず、内部実装のみ変更
3. デフォルトの動作は従来と同じになるよう配慮

### Phase 3: テストの修正

1. ElementSelector.test.tsのモック戦略変更
2. SelectionServiceのモック実装作成
3. 既存のテストケースが通ることを確認

### Phase 4: エントリーポイントの対応

1. `content.ts`など呼び出し元でのElementSelector使用箇所を確認
2. 必要に応じて依存性の注入を実装

## 受け入れ条件の達成

- [x] `window.getSelection()` の記述が`src/infrastructure/selection/SelectionService.ts`のみに存在
- [x] `ElementSelector.test.ts` において、`window.getSelection as any` の記述が削除されている
- [x] `ElementSelector` のテストが通る
- [x] 既存のvitest、playwrightのテストがすべて通る

### issueを進める中で発生した追加タスク
- [ ] SelectionServiceのモック方法を確認

## リスク軽減策

1. **後方互換性**: ElementSelectorのpublic APIは変更しない
2. **段階的実装**: まずSelectionServiceを作成し、その後ElementSelectorを修正
3. **テスト優先**: 各段階でテストが通ることを確認してから次に進む

## 期待される効果

1. **テスト容易性向上**: SelectionServiceをモック可能になり、テストが簡潔に
2. **関心分離**: DOM APIという技術詳細がInfrastructure層に隔離される
3. **将来の拡張性**: Selection取得方法の変更時、影響範囲が限定される

## 実装上の注意点

1. CODINGSTYLEに従い、オブジェクト指向ルールを遵守
2. 既存のテストシナリオは変更しない（仕様変更は行わない制約）
3. 実装は最小限に留め、過度な設計は避ける
