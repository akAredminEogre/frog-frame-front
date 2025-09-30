# ISSUE-062 PULL REQUEST

## タイトル
TabUrlクラスのAPI統一とコード品質向上によるリファクタリング

## 概要と理由
TabUrlクラスとTabIdクラス間のAPI不整合を解消し、ChromeCurrentTabServiceの重複コードを削除することで、codebase全体の保守性と一貫性を向上させる。現在TabUrlクラスはgetValue()メソッドと.valueプロパティの両方を持っているが、TabIdクラスは.valueプロパティのみを持つため、API設計が不統一だった。

## 主な変更点

### 1. TabUrlクラスのAPI統一
- `getValue()`メソッドを削除し、TabIdクラスと同じ`.value`プロパティのみに統一
- コンストラクタのtry-catchネストを削除し、コードフローを直線化
- テスト構造をTabIdクラスと同じ形式に標準化

### 2. ChromeCurrentTabServiceの重複コード削除
- WET（重複コード）を共通メソッドに分離してDRY原則に準拠
- コードの保守性と可読性を向上

### 3. sendApplyRewriteRuleMessageメソッドのシグネチャ統一
- `sendApplyRewriteRuleMessage(tabId: TabId, tabUrl: TabUrl)`を`sendApplyRewriteRuleMessage(currentTab: CurrentTab)`に変更
- CurrentTabオブジェクトを単一パラメータとして受け取る形に統一
- インターフェース（IChromeRuntimeService）、実装（ChromeRuntimeService）、テスト、使用箇所すべてを一貫性を保って更新
- メソッド内で`currentTab.getTabId()`と`currentTab.getTabUrl()`を使用して必要な値を取得

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 本スコープの対象外となったタスク
なし（予定していた全タスクを完了）

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
