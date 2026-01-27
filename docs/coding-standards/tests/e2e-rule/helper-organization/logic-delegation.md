# ヘルパー関数のロジック集約

同一モジュール内で探索ロジックの重複を避けるためのルール。

## 規約

同じ探索・検索ロジックを持つヘルパー関数が複数ある場合、**基本となる1関数にロジックを集約し、他の関数はそれに委譲すること**。

## 理由

- 探索ロジックが重複すると、DOMクエリ回数が不必要に増えてE2E実行時間が伸びる
- ロジック変更時に複数箇所を修正する必要があり保守性が下がる
- 委譲パターンにより、テスト対象のDOMアクセスを最小化できる

## パターン：exists系関数のindex系関数への委譲

「存在確認」関数は「インデックス取得」関数に委譲する。

```typescript
// ❌ 悪い例：探索ロジックが重複
export async function hasRuleWithOldString(page: Page, oldString: string): Promise<boolean> {
  const count = await getRuleCount(page);
  for (let i = 0; i < count; i++) {
    const ruleOldString = await getRuleOldString(page, i);  // 毎回DOMクエリ + 範囲チェック
    if (ruleOldString === oldString) return true;
  }
  return false;
}

export async function getRuleIndexByOldString(page: Page, oldString: string): Promise<number> {
  const count = await getRuleCount(page);
  for (let i = 0; i < count; i++) {
    const ruleOldString = await getRuleOldString(page, i);  // 同じ探索ロジック
    if (ruleOldString === oldString) return i;
  }
  return -1;
}

// ✅ 良い例：基本関数に委譲
export async function getRuleIndexByOldString(page: Page, oldString: string): Promise<number> {
  const count = await getRuleCount(page);
  for (let i = 0; i < count; i++) {
    const ruleOldString = await getRuleOldString(page, i);
    if (ruleOldString === oldString) return i;
  }
  return -1;
}

export async function hasRuleWithOldString(page: Page, oldString: string): Promise<boolean> {
  const index = await getRuleIndexByOldString(page, oldString);
  return index >= 0;  // 委譲
}
```

## 委譲の方向性

| 関数の種類 | 戻り値 | 委譲方向 |
|-----------|--------|---------|
| インデックス取得 | `number` (-1で未検出) | **基本関数**（ロジックを持つ） |
| 存在確認 | `boolean` | インデックス取得に委譲 |
| 要素取得 | 要素/null | インデックス取得に委譲 |

## チェックリスト

ヘルパー関数を追加する際：

- [ ] 同じモジュール内に類似の探索ロジックを持つ関数がないか確認
- [ ] ある場合は基本関数に委譲する形で実装
- [ ] JSDocに「〜に委譲」と明記
