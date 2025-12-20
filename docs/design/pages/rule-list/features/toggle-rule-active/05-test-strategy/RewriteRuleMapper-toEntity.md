# RewriteRuleMapper.toEntity() テスト戦略

## 目的

RewriteRuleDTOからRewriteRuleエンティティへの変換を行う。
全6プロパティ（id, oldString, newString, urlPattern, isRegex, isActive）を正しく変換する。

## テスト分類

### 1. プロパティ変換（同値分割）

各プロパティが正しく変換されることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 全プロパティ変換 | 6プロパティ全てが正しく変換される | 基本動作確認 |
| isActive=true | isActive=trueのDTOを変換 | boolean値の変換確認 |
| isActive=false | isActive=falseのDTOを変換 | boolean値の変換確認 |
| isRegex=true | isRegex=trueのDTOを変換 | boolean値の変換確認 |
| isRegex=false | isRegex=falseのDTOを変換 | boolean値の変換確認 |

**対応テスト**: `normal-cases.test.ts`

## 網羅性チェック

- [x] 全プロパティの変換（6プロパティ）
- [x] isActive true/false の両パターン
- [x] isRegex true/false の両パターン
- [x] 戻り値がRewriteRuleインスタンスであること
- [ ] 異常系（null/undefinedプロパティ） → 不要（RewriteRuleDTOインターフェースで型制約）
- [ ] 境界値 → 不要（文字列・数値の境界はMapper責務外）

## テストファイル構成

```
tests/unit/interface-adapters/mappers/RewriteRuleMapper/toEntity/
└── normal-cases.test.ts       # プロパティ変換（5ケース、配列ベース）
```
