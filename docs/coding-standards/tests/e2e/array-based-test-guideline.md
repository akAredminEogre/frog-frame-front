# E2Eテスト 配列ベーステストガイドライン

E2Eテストにおいて、類似のテストケースを配列化して実装するためのガイドライン。

## 配列化の判断基準

以下の条件を満たす場合、配列ベーステストを採用する：

1. **共通のセットアップ・クリーンアップがある**
2. **アサーションロジックが共通**
3. **異なるのは入力値やアクション部分のみ**
4. **3つ以上の類似テストケースがある**（2つの場合は任意）

## 実装パターン

### 基本構造

```typescript
test.describe('機能名', () => {
  // テストケース定義を配列で宣言
  const testCases = [
    {
      name: 'テストケース1の名前',
      input: '入力値1',
      expected: '期待値1',
      // その他のテスト固有データ
    },
    {
      name: 'テストケース2の名前',
      input: '入力値2',
      expected: '期待値2',
    },
  ];

  // forEach で各テストケースを実行
  testCases.forEach(({ name, input, expected }) => {
    test(name, async ({ page }) => {
      // 共通のセットアップ
      // 共通のアクション（パラメータ化）
      // 共通のアサーション
      // 共通のクリーンアップ
    });
  });
});
```

### 実装例：フォーカストラップテスト

```typescript
// フォーカストラップのテストケース定義
const focusTrapCases = [
  {
    name: 'Tabキーでフォーカスがダイアログ内でループする',
    oldString: 'フォーカストラップテスト',
    keySequence: ['Tab', 'Tab'],
    expectedFocusOrder: [
      'confirm-dialog-confirm-button',
      'confirm-dialog-cancel-button',
    ],
  },
  {
    name: 'Shift+Tabキーでフォーカスが逆方向にループする',
    oldString: '逆方向フォーカステスト',
    keySequence: ['Shift+Tab', 'Shift+Tab'],
    expectedFocusOrder: [
      'confirm-dialog-confirm-button',
      'confirm-dialog-cancel-button',
    ],
  },
];

focusTrapCases.forEach(({ name, oldString, keySequence, expectedFocusOrder }) => {
  test(name, async ({ page, popupPage, rulesPage }) => {
    // 共通のセットアップコード
    const consoleMessages = setupConsoleErrorMonitoring(popupPage, rulesPage);
    await saveRule(popupPage, page, { oldString, newString: '置換後' });
    
    // パラメータ化されたアクション
    for (let i = 0; i < keySequence.length; i++) {
      await rulesPage.keyboard.press(keySequence[i]);
      const expectedElement = rulesPage.locator(
        `[data-testid="${expectedFocusOrder[i]}"]`,
      );
      await expect(expectedElement).toBeFocused();
    }
    
    // 共通のクリーンアップ
    await clickCancelButton(rulesPage);
    assertNoConsoleErrors(consoleMessages);
  });
});
```

## メリット

1. **コード重複の削減**: 共通ロジックを1箇所で管理
2. **保守性の向上**: 変更が必要な場合、1箇所の修正で済む
3. **可読性の向上**: テストケースの差異が明確
4. **拡張性**: 新しいテストケースの追加が容易

## 注意事項

### 避けるべきケース

- **複雑な条件分岐が必要な場合**: 配列化により逆に可読性が下がる
- **共通部分が少ない場合**: 無理に配列化せず、個別のテストとして実装
- **デバッグが困難になる場合**: エラー時にどのケースで失敗したか分かりにくくなる場合は避ける

### ベストプラクティス

1. **テストケース名を明確にする**: `name` プロパティで何をテストしているか明示
2. **データ構造を統一する**: すべてのテストケースで同じプロパティ構造を使用
3. **コメントを活用**: 各プロパティの意味をコメントで説明
4. **過度な抽象化を避ける**: 理解しやすさを優先

## ファイル構成ルール

### 配列化テストファイルの純粋性

**重要**: 配列化テストを使用するファイルには、配列化テスト以外のテストコードを混在させてはならない。

#### 理由

- **一貫性**: ファイル内のテスト構造を統一
- **可読性**: テストの意図が明確になる
- **保守性**: パターンの混在による混乱を防ぐ

#### 実装方法

```typescript
// ✅ 良い例: focus-trap.spec.ts（配列化テストのみ）
test.describe('フォーカストラップ', () => {
  const testCases = [...];
  testCases.forEach(({ name, ... }) => {
    test(name, async () => { ... });
  });
});

// ❌ 悪い例: 配列化テストと個別テストの混在
test.describe('機能テスト', () => {
  // 配列化テスト
  const testCases = [...];
  testCases.forEach(({ name, ... }) => {
    test(name, async () => { ... });
  });
  
  // 個別テスト（禁止）
  test('別のテスト', async () => { ... });
});
```

#### 例外

配列化できない特殊なテストケースがある場合は、別ファイルに分離すること。

## 単体テストとの違い

| 観点 | 単体テスト | E2Eテスト |
|------|-----------|-----------|
| テストケース数 | 多い（境界値、異常系など） | 少ない（主要シナリオのみ） |
| 実行時間 | 高速 | 低速 |
| セットアップ | 軽量（モック使用） | 重い（実環境構築） |
| 配列化の閾値 | 2つ以上で検討 | 3つ以上で検討 |

## 関連ドキュメント

- [単体テスト 配列ベーステスト](../array-based-tests.md)
- [E2E テストルール](./index.md)
- [テスト命名規則](./naming-rules.md)