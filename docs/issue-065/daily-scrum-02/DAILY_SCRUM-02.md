# DAILY SCRUM-02回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->
Storybookを利用したatomic designでのUI再現（基本コンポーネント作成）を行う。具体的には：
- 前回調査結果に基づいたAtomsコンポーネントの作成
- Moleculesコンポーネントの基本設計と実装
- Storybookストーリーの作成
- 既存App.tsxのUIとの見た目の整合性確認

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->
- host-frontend-root/frontend-src-root/src/components/atoms/ (新規作成)
- host-frontend-root/frontend-src-root/src/components/molecules/ (新規作成)
- host-frontend-root/frontend-src-root/src/stories/ (新規作成)
- .storybook/main.ts (設定追加)

## スクラム内残タスク
- [ ] Storybookの設定確認・調整
- [ ] CSS modulesの基本設定とデザイントークン定義
- [ ] Atoms: Button, Input, TextArea, Checkbox, Label コンポーネント作成（CSS modules使用）
- [ ] Atoms: Title, Description コンポーネント作成（CSS modules使用）
- [ ] Molecules: 置換前入力セクション、置換後入力セクション作成
- [ ] Molecules: URLパターン入力セクション作成
- [ ] 各コンポーネントのStorybookストーリー作成
- [ ] 既存App.tsxとの見た目比較・調整
- [ ] デザイントークンの標準化（色・サイズ・間隔の統一）

## 相談事項
<!-- workflow:01-create-daily-scrum-doc-after-coding.mdの場合は作成しない -->
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->

Storybookでのatomic design実装において、以下の点について方針を確認したいです：

1. TypeScriptの型定義について、propsインターフェースをどの程度厳密に定義すべきでしょうか？（atoms段階での型安全性の範囲）
  - → 現段階での型安全性は最低限で構いません。将来的に必要に応じて厳密化してください。
2. スタイリング手法について、CSS-in-JSとCSS modules、どちらをatomic designの実装で採用すべきでしょうか？
  - CSS modulesを採用してください。
3. 既存App.tsxのスタイリング（インラインスタイル）を参考にする際、色・サイズ・間隔などのデザイントークンをどのように標準化すべきでしょうか？
  - 既存App.tsxのスタイリングを参考にしつつ、atomic designの原則に従い、再利用性を重視して標準化してください。

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->
調査フェーズから実装フェーズへ！Storybookでatomic designを実際に形にしていく段階でワクワクしています。

# DAILY SCRUM-02作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

### 1. Storybookを利用したatomic designでのUI再現（基本コンポーネント作成）
- デザイントークンの定義（色、サイズ、フォント、間隔の標準化）
- Atomsコンポーネントの実装（Input, TextArea, Checkbox, Title, Description）
- Moleculesコンポーネントの実装（InputSection）
- Storybookストーリーの作成（Inputコンポーネント）
- 既存App.tsxとの見た目比較・調整

### 2. 共通UI部品の作成と状態管理実装
- 新規登録と編集で見た目を共通化したコンポーネント設計
- 新規登録画面の状態管理実装（popup/App.tsx ベース）
- RewriteRuleFormコンポーネントの実装と改善

### 3. コード品質向上とレビュー対応
- RewriteRuleForm.tsxのコード改善（三項演算子排除、責務分離）
- 型安全性の向上（HTMLInputElementとHTMLTextAreaElementの分離対応）
- Checkboxコンポーネントの表示順序変更（「正規表現を使う □」順序に修正）
- テストとリントの品質確保、未使用コードの除去

### 4. Atomic Design アーキテクチャの構築
- CSS modulesを使用したスタイリング手法の統一
- 再利用可能なコンポーネント設計
- 型安全性を重視したイベントハンドラーの実装

## 修正したファイル

### 新規作成ファイル
- `src/components/tokens.module.css` - デザイントークン定義
- `src/components/atoms/Input.tsx` - Input Atomコンポーネント
- `src/components/atoms/Input.module.css` - Input スタイル
- `src/components/atoms/TextArea.tsx` - TextArea Atomコンポーネント
- `src/components/atoms/TextArea.module.css` - TextArea スタイル
- `src/components/atoms/Checkbox.tsx` - Checkbox Atomコンポーネント
- `src/components/atoms/Checkbox.module.css` - Checkbox スタイル
- `src/components/atoms/Title.tsx` - Title Atomコンポーネント
- `src/components/atoms/Title.module.css` - Title スタイル
- `src/components/atoms/Description.tsx` - Description Atomコンポーネント
- `src/components/atoms/Description.module.css` - Description スタイル
- `src/components/molecules/InputSection.tsx` - InputSection Moleculeコンポーネント
- `src/components/molecules/InputSection.module.css` - InputSection スタイル
- `src/components/atoms/Input.stories.tsx` - Input Storybookストーリー
- `src/components/molecules/LabeledInput.tsx` - LabeledInput Moleculeコンポーネント
- `src/components/molecules/NewStringTextArea.tsx` - NewString入力用Moleculeコンポーネント
- `src/components/molecules/OldStringTextArea.tsx` - OldString入力用Moleculeコンポーネント
- `src/components/molecules/URLPatternInput.tsx` - URLPattern入力用Moleculeコンポーネント
- `src/components/organisms/RewriteRuleForm.tsx` - RewriteRule編集用Organismコンポーネント
- `src/components/organisms/RewriteRuleForm.module.css` - RewriteRuleForm スタイル
- `src/components/organisms/NewStringTextArea.tsx` - NewString入力用Organismコンポーネント
- `src/components/organisms/OldStringTextArea.tsx` - OldString入力用Organismコンポーネント
- `src/components/organisms/URLPatternInput.tsx` - URLPattern入力用Organismコンポーネント

### 修正ファイル
- `src/components/atoms/Checkbox.tsx` - 表示順序変更（「正規表現を使う □」順序に修正）
- `src/entrypoints/popup/App.tsx` - 新しいコンポーネントとの統合

### テストファイル
- `tests/e2e/get-origin.spec.ts` - E2Eテスト対応
- `tests/e2e/popup.spec.ts` - ポップアップE2Eテスト対応
