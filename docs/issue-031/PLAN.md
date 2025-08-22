# issue-031 実装計画：改行コード・空白を無視した文字列置換機能

## 概要
HTMLタグ内に改行コードや空白が含まれている場合でも、ユーザーが意識することなく文字列置換ができるようにする。

## 問題分析
- 現在の実装（`HtmlContent.replaceWith`）では、文字列の完全一致でのみ置換が可能
- アジャイルマニフェストサイトの `<h1>アジャイルソフトウェア開発宣言\n</h1>` のように、HTMLソース上に改行が含まれる場合、ユーザーが入力した `<h1>アジャイルソフトウェア開発宣言</h1>` とマッチしない

## 実装アプローチ

### 1. 新しいValue Objectの作成
**対象ファイル**: `src/domain/value-objects/NormalizedString.ts`
- 改行コードや空白を正規化する責務を持つ
- オブジェクト指向ルールに従い、プリミティブ型をラップ

### 2. HtmlContent クラスの修正
**対象ファイル**: `src/domain/entities/HtmlContent.ts`
- 正規表現を使わない場合の置換ロジックを修正
- 改行コードや空白を無視した文字列マッチングを実装

### 3. e2eテストの追加
**対象ファイル**: `tests/e2e/ignore-crlf-replace.spec.ts`
- アジャイルマニフェストサイトでの実際のテストケースを実装
- 正規表現を使わない置換で改行コードを無視できることを確認

### 4. ユニットテストの追加・修正
**対象ファイル**: 
- `tests/unit/domain/value-objects/NormalizedString.test.ts`
- `tests/unit/domain/entities/HtmlContent.test.ts`

## 詳細実装計画

### Phase 1: Value Objectの作成
```typescript
// src/domain/value-objects/NormalizedString.ts
export class NormalizedString {
  private readonly value: string;

  constructor(text: string) {
    this.value = this.normalize(text);
  }

  private normalize(text: string): string {
    // すべての空白文字（改行、タブ、空白）を完全に除去して比較用の文字列を作成
    return text.replace(/\s+/g, '');
  }

  equals(other: NormalizedString): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  indexOf(searchString: NormalizedString): number {
    return this.value.indexOf(searchString.value);
  }

  replace(searchString: NormalizedString, replaceString: string): string {
    return this.value.replace(searchString.value, replaceString);
  }
}
```

### Phase 2: HtmlContent の修正
```typescript
// src/domain/entities/HtmlContent.ts の replaceWith メソッド修正
public replaceWith(rule: RewriteRule): ReplaceResult {
  const oldString = rule.oldString;
  const newString = rule.newString;

  if (rule.isRegex) {
    // 既存の正規表現ロジック（変更なし）
    const regex = new RegExp(oldString, 'gs');
    const matches = [...this.originalHtml.matchAll(regex)];
    const matchCount = matches.length;
    if (matchCount === 0) {
      return new ReplaceResult(this.originalHtml, 0);
    }
    const replacedHtml = this.originalHtml.replace(regex, newString);
    return new ReplaceResult(replacedHtml, matchCount);
  } else {
    // 新しい改行コード無視ロジック
    const normalizedHtml = new NormalizedString(this.originalHtml);
    const normalizedOldString = new NormalizedString(oldString);
    
    if (normalizedHtml.indexOf(normalizedOldString) === -1) {
      return new ReplaceResult(this.originalHtml, 0);
    }
    
    // 正規化された文字列でマッチング位置を特定し、元のHTMLで置換対象範囲を見つける
    const normalizedStartIndex = normalizedHtml.indexOf(normalizedOldString);
    const actualRange = this.findActualRange(normalizedStartIndex, normalizedOldString.toString().length);
    
    // 元のHTMLの該当範囲を新しい文字列で置換
    const replacedHtml = this.originalHtml.substring(0, actualRange.start) + 
                        newString + 
                        this.originalHtml.substring(actualRange.end);
    
    return new ReplaceResult(replacedHtml, 1);
  }
}

private findActualRange(normalizedStart: number, normalizedLength: number): { start: number, end: number } {
  // 正規化されたインデックスを元のHTMLのインデックスにマッピング
  let actualIndex = 0;
  let normalizedIndex = 0;
  
  // normalizedStartまでの実際の位置を特定
  while (normalizedIndex < normalizedStart && actualIndex < this.originalHtml.length) {
    const char = this.originalHtml[actualIndex];
    if (!/\s/.test(char)) {
      normalizedIndex++;
    }
    actualIndex++;
  }
  
  const start = actualIndex;
  
  // normalizedLengthに対応する実際の終了位置を特定
  let remainingLength = normalizedLength;
  while (remainingLength > 0 && actualIndex < this.originalHtml.length) {
    const char = this.originalHtml[actualIndex];
    if (!/\s/.test(char)) {
      remainingLength--;
    }
    actualIndex++;
  }
  
  return { start, end: actualIndex };
}
```

### Phase 3: e2eテストの実装
```typescript
// tests/e2e/ignore-crlf-replace.spec.ts
test('改行コードを無視した文字列置換機能のe2eテスト', async ({ page, popupPage }) => {
  // 1. アジャイルマニフェストサイトに移動
  await page.goto('https://agilemanifesto.org/iso/ja/manifesto.html');
  
  // 2. 実際のDOM構造確認（改行を含む）
  const h1Html = await page.locator('h1').innerHTML();
  expect(h1Html).toContain('\n'); // 改行が含まれることを確認
  
  // 3. ポップアップで置換設定（正規表現なし）
  await beforeInput.fill('<h1>アジャイルソフトウェア開発宣言</h1>');
  await afterInput.fill('<h2>アジャイルソフトウェア開発宣言</h2>');
  // 正規表現チェックボックスは空のまま
  
  // 4. 保存・適用
  await saveButton.click();
  
  // 5. 置換結果確認
  await expect(page.locator('h2')).toHaveText('アジャイルソフトウェア開発宣言');
  await expect(page.locator('h1')).toHaveCount(0);
});
```

## 実装手順

### ステップ 1: Value Object作成
- [ ] `NormalizedString.ts` 作成
- [ ] `NormalizedString.test.ts` 作成・テスト実装

### ステップ 2: HtmlContent修正
- [ ] `HtmlContent.ts` の `replaceWith` メソッド修正
- [ ] 既存のユニットテスト修正・新規テスト追加

### ステップ 3: e2eテスト追加
- [ ] `ignore-crlf-replace.spec.ts` 作成・実装

### ステップ 4: 統合テスト
- [ ] 全てのユニットテストが通ることを確認
- [ ] 全てのe2eテストが通ることを確認
- [ ] 既存機能に影響がないことを確認

## 受け入れ条件チェック
- [ ] 上記ユースケースのe2eテストが追加され、パスするように実装が変更されている
- [ ] そのe2eテストが通ること
- [ ] 既存のe2eテストが通ること
- [ ] 変更箇所については、`CODING_STYLE.md` の `# オブジェクト指向ルール` に従っていること

## 技術的制約・考慮事項
- オブジェクト指向ルール（ThoughtWorksアンソロジー）への準拠
- クリーンアーキテクチャの維持
- 既存機能への影響最小化
- パフォーマンスへの配慮（大きなHTMLでの処理速度）

## リスク・懸念事項
- 複雑なHTMLでの正規化処理の精度
- 既存のエッジケースへの影響
- 処理パフォーマンスの劣化可能性
