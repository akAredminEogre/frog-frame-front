# DAILY SCRUM-05回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
- DomDiffer の basic-replacement.test.ts のテストケースリファクタリング
  - 'Simple Element Replacement' 以外のテストケースをarrange / act / assert を共通化
  - テスト配列化のコード規約に沿ったリファクタリング実施
- 'Table Row Replacement' テストケースの新規対応
  - 新しく追加されたテストケースをpassするようにプロダクションコードを修正

## 修正予定ファイル
- `tests/unit/domain/entities/DomDiffer/basic-replacement.test.ts`
- `src/domain/entities/DomDiffer.ts` (Table Row Replacement対応)

## スクラム内残タスク
- [ ] basic-replacement.test.ts のテストケースのarrange/act/assert共通化とテスト配列化リファクタリング
- [ ] Table Row Replacement機能のプロダクションコード実装
- [ ] リファクタリング後のテスト実行確認

## 相談事項
<!-- 特になし -->

## 一言コメント
テストコードのリファクタリングと新機能の追加を同時に進める効率的なスクラムとなりそうです。

# DAILY SCRUM-05作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

## 修正したファイル
<!-- スクラム単位での変更を記入 -->
<!-- 進捗としては変化があっても、スクラムとして変更がなかったファイルは記入しない -->