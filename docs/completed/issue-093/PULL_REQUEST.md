# ISSUE-093 PULL REQUEST

## タイトル
E2EテストをローカルHTMLファイルに移行して外部サイト依存を排除

## 概要と理由
E2Eテストのローカル化作業を完了させました。

これまでE2Eテストは外部Webサイト（agilemanifesto.org、www01.hanmoto.com）にアクセスしてテストを実行していました。これには以下の問題がありました：

- 外部サイトの可用性に依存するため、サイトがダウンするとテストが失敗する
- ネットワーク接続が必要で、テストの実行が遅くなる
- 外部サイトのDOM構造が変更されるとテストが壊れる
- テスト環境の制御性が低い

これらの問題を解決するため、すべてのE2Eテストをリポジトリ内のローカルHTMLファイルを使用するように変更しました。

## 主な変更点

### 1. E2Eテスト用ローカルHTMLファイルの追加
- **ファイル**: `host-frontend-root/frontend-src-root/tests/e2e/test-pages/agile-manifesto.html`
- **内容**: アジャイルソフトウェア開発宣言のページ（改行を含むh1タグを持つ静的HTML）
- **用途**: 以下のテストで使用
  - `save-and-replace.spec.ts`
  - `ignore-crlf-replace.spec.ts`
  - `ignore-crlf-replace-with-regex.spec.ts`
- **理由**: 外部サイト（agilemanifesto.org）への依存を排除し、テストの安定性を向上

**注**: `book-page.html`は既に存在しており、以下のテストで使用：
- `edit-page.spec.ts`（両方のテスト）
- `replace-inside-dom-with-regex.spec.ts`

### 2. edit-page.spec.tsのローカル化
- **ファイル**: `host-frontend-root/frontend-src-root/tests/e2e/edit-page.spec.ts`
- **変更内容**: 2つのテストケースを外部サイト（www01.hanmoto.com）から`book-page.html`を使用するように変更
  - テスト1: 「正規表現で取得した値をタグ内に埋め込んだルールが、一覧に表示され、編集できる」
  - テスト2: 「編集画面でキャンセルボタンをクリックすると、ポップアップが閉じる」
- **主な変更箇所**:
  - URL: `https://www01.hanmoto.com/bd/isbn/9784065396209` → `http://localhost:8080/book-page.html`
  - 期待URLパターン: `https://www01.hanmoto.com` → `http://localhost:8080`
  - リンク先URL: `https://www01.hanmoto.com/bd/isbn/$1` → `https://example.com/isbn/$1`
- **理由**: 外部サイトへの依存を排除し、テストの安定性と実行速度を向上

### 3. ignore-crlf系テストのローカル化
- **ファイル**:
  - `host-frontend-root/frontend-src-root/tests/e2e/ignore-crlf-replace.spec.ts`
  - `host-frontend-root/frontend-src-root/tests/e2e/ignore-crlf-replace-with-regex.spec.ts`
- **変更内容**: 外部サイト（agilemanifesto.org）から`agile-manifesto.html`を使用するように変更
- **主な変更箇所**:
  - URL: `https://agilemanifesto.org/iso/ja/manifesto.html` → `http://localhost:8080/agile-manifesto.html`
  - 期待URLパターン: `https://agilemanifesto.org` → `http://localhost:8080`
  - タイムアウト設定の追加（安定性向上）
- **理由**: 外部サイトへの依存を排除し、改行コード処理のテストの信頼性を向上

### 4. save-and-replace.spec.tsのローカル化
- **ファイル**: `host-frontend-root/frontend-src-root/tests/e2e/save-and-replace.spec.ts`
- **変更内容**: 外部サイト（agilemanifesto.org）から`agile-manifesto.html`を使用するように変更
- **主な変更箇所**:
  - URL: `https://agilemanifesto.org/iso/ja/manifesto.html` → `http://localhost:8080/agile-manifesto.html`
  - 期待URLパターン: `https://agilemanifesto.org` → `http://localhost:8080`
- **理由**: 外部サイトへの依存を排除し、DOM置換機能テストの安定性を向上

### 5. Claude Code設定の更新
- **ファイル**: `.claude/settings.local.json`
- **変更内容**: `make test-and-lint`を自動承認リストに追加
- **理由**: 開発効率向上のため、頻繁に使用する包括的なテストコマンドを事前承認

## テスト方法
[動作確認の手順]
- `make test-and-lint` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
  - ユニットテスト: 263 passed
  - E2Eテスト: 9 passed
  - 未使用コード検出: 問題なし
  - リント: 問題なし

すべてのE2Eテストが外部サイトへのアクセスなしで完全に動作することを確認済み。

## 補足
この変更により、以下のメリットが得られます：

1. **テストの安定性向上**: 外部サイトの可用性や変更に影響されない
2. **実行速度の向上**: ネットワークアクセスが不要なため、テスト実行が高速化
3. **オフライン開発対応**: インターネット接続がなくてもテストが実行可能
4. **テスト環境の制御性向上**: DOM構造を完全に制御でき、テストケースの設計が容易

すべてのE2EテストファイルがローカルHTMLファイルまたは拡張機能自体のページのみを使用するようになり、外部依存が完全に排除されました。

## 本スコープの対象外となったタスク
なし


<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
