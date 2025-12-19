# ToggleRuleActiveInputData.constructor() テスト戦略

## 目的

ルール有効/無効切り替えの入力データ（ruleId）を保持するDTOを生成する。

## テスト分類

### 1. 正常系（インスタンス生成）

様々なruleIdでインスタンスを生成できることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 小さい値 | ruleId=1 | 基本パターン |
| 中間の値 | ruleId=100 | 一般的なケース |
| 大きい値 | ruleId=999999 | 境界条件（大きな値） |

**対応テスト**: `normal-cases.test.ts`

## 網羅性チェック

- [x] 様々なruleId値でインスタンス生成（3パターン）
- [x] ruleIdが正しく保持されること
- [ ] 読み取り専用性 → TypeScriptの型システムで保証（ランタイムテスト不要）
- [ ] 異常系 → 不要（InteractorがruleIdの存在を検証、DTOは値を保持するのみ）

## テストファイル構成

```
tests/unit/application-business-rules/dto/input/ToggleRuleActiveInputData/constructor/
└── normal-cases.test.ts       # インスタンス生成（3ケース、配列ベース）
```
