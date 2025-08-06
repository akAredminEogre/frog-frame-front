# ISSUE-011 PULL REQUEST

## タイトル
正規表現を使ったDOM置換機能のe2eテスト実装

## 概要と理由
アジャイルソフトウェア開発宣言のページ（https://agilemanifesto.org/iso/ja/manifesto.html）でDOM置換機能をテストするe2eテストを実装しました。このテストにより、ブラウザ拡張機能の中核機能である正規表現を使ったDOM置換が正常に動作することを自動検証できるようになります。

## 主な変更点
- `save-and-replace.spec.ts`にDOM置換機能のe2eテストを実装
  - 正規表現パターン `<h1>(.+?)</h1>` から `<h2>$1</h2>` への置換テスト
  - 正規表現チェックボックスの操作テスト
  - アラートダイアログ「保存して適用しました！」の表示確認
  - DOM要素の置換結果確認（h1→h2要素への変換）
- コードレビューに基づく実装品質の向上
  - 複雑な`.or()`チェーンを`getByLabel()`のシンプルな実装に変更
  - デバッグ用ロジックの削除による保守性向上
  - Playwrightの`page.on('dialog')`を使ったアラートテスト実装

## テスト方法
```bash
cd ~/akAredminEogre-project/favorite-keyword-link-frog && docker compose exec frontend npm run test:e2e
```

実行結果：
```
Running 3 tests using 3 workers
✓ URLパターンのフォームにブラウザに表示されているページのURLのドメインが自動入力されている (14.8s)
✓ 正規表現を使ったDOM置換機能のe2eテスト (18.5s)
✓ 拡張機能のポップアップが正しく表示される (10.8s)

3 passed (22.0s)
```

## 補足
- 既存の全e2eテストが引き続き通過することを確認済み
- 実装過程で2回のコードレビューを実施し、コード品質の向上を図った
- 外部サイト（agilemanifesto.org）への依存があるため、ネットワーク環境に注意が必要
- `fixtures.ts`の既存実装で十分対応でき、追加修正は不要だった
- プロダクションコードは修正せず、テストコードのみの追加実装
