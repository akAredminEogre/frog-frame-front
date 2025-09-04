# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->

## Story-1: 開発者としてgetElementSelectionロジックをapplication層に移管することにより、Clean Architectureに準拠したコード構造を得る

getElementSelectionロジックが現在content.ts内で直接実装されているため、責務が混在している。
このロジックをapplication層のユースケースクラスに移管し、適切な層分離を実現する。

### タスク

- [x] GetElementSelectionUseCaseクラスの新規作成
- [x] content.tsからgetElementSelectionInfo関数の削除
- [x] content.tsでGetElementSelectionUseCaseを使用するように修正
- [x] ビルドテストの実施
- [x] 動作確認

## Story-2: 開発者としてElementSelectorのinfrastructure依存を削除することにより、Clean Architectureに完全準拠したドメイン層を得る

ElementSelectorがdomain層にありながらinfrastructure層のSelectionServiceを直接呼び出しており、Clean Architectureの原則に違反している。
この依存関係をGetElementSelectionUseCase層に移管し、適切な層分離を実現する。

### タスク

- [x] ElementSelectorからSelectionService依存を削除
- [x] getElementFromSelection メソッドのAPI変更（パラメータでrangeとselectedTextを受け取るように修正）
- [x] GetElementSelectionUseCaseでinfrastructure呼び出しを担当するように修正
- [x] ElementSelector.test.tsの全テストケース修正（14個のテスト）
- [x] TypeScriptコンパイル確認
- [x] ビルドテスト実施
- [x] 動作確認
