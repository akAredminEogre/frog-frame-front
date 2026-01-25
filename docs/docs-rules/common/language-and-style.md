# 使用言語・文体・表記

## 使用言語

**ドキュメントは日本語で記述すること。**

- コード例やコマンド例は英語のまま記載可
  - コードブロック（` ``` `）内のコード
  - インラインコード（`` ` ` ``）内のコード・コマンド・ファイルパス
- 技術用語は英語表記も許容（例: Clean Architecture, Repository）
- 技術用語の大文字小文字は公式表記に従うこと
  - ESLint（❌ ESlint, Eslint, eslint）
  - TypeScript（❌ Typescript, typescript）
  - JavaScript（❌ Javascript, javascript）
  - GitHub（❌ Github, github）
  - npm（❌ NPM, Npm）
- コードフェンス言語識別子は小文字を使用
  - ` ```typescript `（❌ ` ```Typescript `）
  - ` ```javascript `（❌ ` ```Javascript `）
  - これは業界標準の慣例であり、製品名の表記ルールとは別

### Lint化について

| 規約 | Lint化 | 備考 |
|-----|--------|------|
| 技術用語の大文字小文字 | △ | textlint/cspellで部分的に可能 |
| コードフェンス言語識別子 | ✅ | markdownlintで検証可能 |

→ [User Story 011: markdownlint導入](../../../user-stories/user-story-011/README.md)

## 文体

- 文体は断定系を使うこと
  - ですます調は使わない

## 括弧について

- 全角の括弧を使わない
  - 例: （全角） → (半角)
