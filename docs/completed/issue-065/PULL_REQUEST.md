# ISSUE-065 PULL REQUEST

## タイトル
RewriteRuleの編集機能実装

## 概要と理由
既存のRewriteRuleを編集する機能を実装しました。ユーザーがrules.htmlから既存ルールを編集し、変更を保存すると該当タブに自動反映される機能です。

新規登録機能（popup/App.tsx）は存在していましたが、一度作成したルールを修正する手段がなく、ユーザービリティに課題がありました。本機能により、ルールの修正が容易になり、より柔軟な運用が可能になります。

## 主な変更点

### 1. 編集ページの実装（edit.html）
- 新規エントリーポイント`entrypoints/edit/`を作成
- EditRulePageコンポーネントを実装し、URLパラメータ（ruleId）からルールを読み込み
- RewriteRuleFormコンポーネントを再利用し、新規登録と編集で見た目を共通化

### 2. ルール一覧画面（rules.html）への編集ボタン追加
- RulesAppコンポーネントに編集ボタンを追加
- 編集ボタンクリック時、edit.htmlをタブで開く機能を実装

### 3. UseCaseレイヤーの拡張
- `LoadRewriteRuleForEditUseCase`: IDによるルール取得
- `UpdateRewriteRuleUseCase`: ルール更新とタブへの自動反映
- `OpenRuleEditPageUseCase`: 編集ページを新規タブで開く
- `CloseCurrentWindowUseCase`: 編集完了後のタブクローズ

### 4. ドメイン層の強化
- `RewriteRule.fromParams()`: ファクトリメソッド追加による型安全性向上
- `RewriteRuleParams`型の一元管理によるコードの重複排除
- `Tab.matchesRule()`: URL判定ロジックのカプセル化
- `Tabs`ファーストクラスコレクションの導入

### 5. インフラストラクチャ層の拡張
- `IWindowService`インターフェースと`ChromeWindowService`実装の追加
- `IChromeTabsService`に`openRuleEditPage()`メソッド追加
- `sendApplyAllRulesMessage()`メソッドによるメッセージ送信ロジックの集約

### 6. UIコンポーネントの改善
- `CancelButton`コンポーネントの追加とStorybookストーリー作成
- `RewriteRuleForm`のStorybookストーリー作成
- CSS modulesによるスタイリング統一

### 7. テストの充実
- E2Eテスト: 編集フロー全体のテスト（edit-page.spec.ts）
- ユニットテスト: 新規UseCaseのテスト、リポジトリ層のgetById/updateテスト
- 全テスト262件が成功

### 8. Storybookの整備
- Atoms/Molecules/Organismsレイヤーのストーリーファイル作成
- コンポーネントの視覚的確認とドキュメント化

### 9. アーキテクチャの改善
- DIパターンの一貫した適用
- クリーンアーキテクチャの徹底（レイヤー間の依存関係の適切な管理）
- ポート＆アダプターパターンの適用（infrastructure層の実装詳細隠蔽）

その他細かい変更は、
PRの #112～#127に分割されたため、そちらを参照してください。

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認

### 手動テスト確認項目
1. rules.htmlで編集ボタンをクリックし、edit.htmlが新規タブで開くことを確認
2. 編集画面で各項目（URL、置換前、置換後、正規表現フラグ）が正しく表示されることを確認
3. 値を変更して保存ボタンをクリックし、rules.htmlのルール行が更新されることを確認
4. 該当するタブが存在する場合、タブの内容も自動更新されることを確認
5. キャンセルボタンをクリックし、編集画面のタブが閉じることを確認


## 本スコープの対象外となったタスク
特になし。ISSUE.mdで定義された受け入れ条件をすべて満たしました。

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
