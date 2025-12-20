# RewriteRuleMapper.toDto() テスト戦略

## 目的

RewriteRuleエンティティからRewriteRuleDTOへの変換を行う。
全6プロパティ（id, oldString, newString, urlPattern, isRegex, isActive）を正しく変換する。

## テスト分類

### 1. プロパティ変換（同値分割）

各プロパティが正しく変換されることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 全プロパティ変換 | 6プロパティ全てが正しく変換される | 基本動作確認 |
| isActive=true | isActive=trueのエンティティを変換 | boolean値の変換確認 |
| isActive=false | isActive=falseのエンティティを変換 | boolean値の変換確認 |
| isRegex=true | isRegex=trueのエンティティを変換 | boolean値の変換確認 |
| isRegex=false | isRegex=falseのエンティティを変換 | boolean値の変換確認 |

**対応テスト**: `normal-cases.test.ts`

## 網羅性チェック

- [x] 全プロパティの変換（6プロパティ）
- [x] isActive true/false の両パターン
- [x] isRegex true/false の両パターン
- [x] 戻り値がRewriteRuleDTO形式のオブジェクトであること
- [ ] 異常系（nullエンティティ） → 不要（TypeScriptの型制約で防止）
- [ ] 境界値 → 不要（文字列・数値の境界はMapper責務外）

## テストファイル構成

```
tests/unit/interface-adapters/mappers/RewriteRuleMapper/toDto/
└── normal-cases.test.ts       # プロパティ変換（5ケース、配列ベース）
```
