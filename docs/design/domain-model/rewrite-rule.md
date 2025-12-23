# リライトルール (RewriteRule)

## 概要

ユーザーが定義するDOM書き換えルール。Webページ上のテキストを自動的に検索・置換するための設定を保持する。

## 属性

| 属性 | 型 | 説明 |
|------|-----|------|
| id | number | ルールの一意識別子 |
| urlPattern | string | ルールを適用する対象URLのパターン（前方一致） |
| oldString | string | 検索パターン（置換対象のテキスト） |
| newString | string | 置換後のテキスト |
| isRegex | boolean | 検索パターンが正規表現かどうか |
| isActive | boolean | ルールの有効/無効状態（デフォルト: true） |

## 適用条件

ルールがページに適用されるための条件:

1. ページのURLが `urlPattern` に前方一致する
2. ルールが有効状態 (`isActive = true`) である

## ビジネスルール

### URLマッチング

- `urlPattern` が空文字列の場合、どのURLにもマッチしない
- `urlPattern` は**前方一致**で判定される
  - 例: `urlPattern = "https://example.com/app"` は `https://example.com/app/page` にマッチする

### 有効/無効状態

- `isActive = true` のルールのみがDOM適用の対象となる
- `isActive = false` のルールは保存されているが適用されない

### パターン処理

- `isRegex = false`: 検索パターンはプレーンテキストとして扱われる
- `isRegex = true`: 検索パターンは正規表現として解釈される
- HTML要素間の空白・改行は自動的に無視される（ユーザーが意識しなくてよい）

## 状態遷移

```
                    ルール作成
                        │
                        ▼
              ┌─────────────────┐
              │ isActive = true │
              │   （有効）       │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             │             ▼
    トグル操作          │        ルール削除
         │             │             │
         ▼             │             ▼
┌─────────────────┐    │         (消滅)
│ isActive = false│    │
│   （無効）       │    │
└────────┬────────┘    │
         │             │
         └─────────────┘
            トグル操作
```

## ユースケースとの関係

| ユースケース | RewriteRuleの役割 |
|-------------|------------------|
| ページロード時ルール適用 | `urlPattern` でマッチ判定、`isActive` で適用可否判定 |
| ルールトグル | `isActive` の切り替え |
| ルール編集 | 全属性の更新 |
| ルール一覧表示 | 全属性の表示 |

## 不変条件 (Invariants)

- `id` は作成後変更されない
- `RewriteRule` はイミュータブル（状態変更時は新しいインスタンスを生成）
- `urlPattern` が空でない限り、少なくとも1つのURLにマッチする可能性がある

## 関連機能

- [ページロード時ルール適用](../features/page-load-rule-application/00-overview.md)
- [ルールトグル機能](../pages/rule-list/features/toggle-rule-active/00-overview.md)
