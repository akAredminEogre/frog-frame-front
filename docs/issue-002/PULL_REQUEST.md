# NodeTextReplacerのリファクタリング

## 概要

NodeTextReplacerクラスがファット化していたため、CODING_STYLE.mdに記載されているオブジェクト指向ルールに従い、責務を分割するリファクタリングを実施しました。

## 変更内容

### 🎯 主要な変更

1. **ReplacementValue ValueObjectの作成**
   - `oldString`がHTML文字列かプレーンテキストかを判定するロジックを持つValueObjectを実装
   - HTML判定ロジックを正規表現ベースで実装

2. **TextReplacer Entityの作成**
   - プレーンテキストの置換ロジック責務を担うクラスを分離
   - テキストノード内のシンプルな文字列置換機能を実装

3. **HtmlReplacer Entityの作成**
   - HTML要素の置換ロジック責務を担うクラスを分離
   - DOM操作によるHTML要素の置換機能を実装

4. **NodeTextReplacerのリファクタリング**
   - ファサードパターンを採用し、`ReplacementValue`の判定結果に基づいて適切なReplacerに処理を委譲
   - 単一責任原則に従った設計に変更

### 📁 新規作成ファイル

- `src/domain/value-objects/ReplacementValue.ts`
- `src/domain/value-objects/__tests__/ReplacementValue.test.ts`
- `src/domain/entities/TextReplacer.ts`
- `src/domain/entities/__tests__/TextReplacer.test.ts`
- `src/domain/entities/HtmlReplacer.ts`
- `src/domain/entities/__tests__/HtmlReplacer.test.ts`

### 🔧 修正ファイル

- `src/domain/entities/NodeTextReplacer.ts`
- `src/domain/entities/__tests__/NodeTextReplacer.test.ts`

## テスト

### ✅ ユニットテスト
- 新規作成したすべてのクラスに対応するユニットテストを作成
- 既存のNodeTextReplacerのユニットテストをリファクタリング後の構造に合わせて修正
- すべてのユニットテストが通過することを確認

### ✅ E2Eテスト
- 既存のE2Eテストがすべて通過することを確認
- リファクタリング後も既存機能に影響がないことを検証

## アーキテクチャ

### Before
```
NodeTextReplacer
├── プレーンテキスト置換ロジック
├── HTML置換ロジック
└── 判定ロジック
```

### After
```
NodeTextReplacer (Facade)
├── ReplacementValue (ValueObject)
│   └── HTML判定ロジック
├── TextReplacer (Entity)
│   └── プレーンテキスト置換ロジック
└── HtmlReplacer (Entity)
    └── HTML置換ロジック
```

## チェックリスト

- [x] NodeTextReplacerが、CODING_STYLE.mdに記載されているオブジェクト指向ルールに可能な限り従ってリファクタリングされていること
- [x] リファクタリング後のコードのユニットテストが作成され、通過していること
- [x] 既存のユニットテストがすべて通過していること
- [x] 既存のe2eテストがすべて通過していること

## 関連Issue

NodeTextReplacerのリファクタリング（issue-002）

## 備考

- 単一責任原則に基づき、各クラスが明確な責務を持つように設計
- ファサードパターンにより既存のインターフェースを維持しつつ内部構造を改善
- 依存性注入を活用し、テスト容易性を向上
- すべての新規クラスに包括的なユニットテストを実装
