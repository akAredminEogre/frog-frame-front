# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=05
実装が完了したらPROGRESS-05-01.mdを追記してコードレビューを依頼してください
## スクラム-05(01回目) の進捗
Table Row Replacement機能の実装とテストリファクタリングが完了しました。

### 実装内容
- ReplaceElementPreservingStateにテーブル要素用の適切なHTMLパーサーコンテキスト機能を追加
  - テーブル関連要素（tr, td, th, thead, tbody, tfoot）に対して正しいHTML構造を保持する機能を実装
  - createAppropriateParserContainer()メソッドでテーブル要素のコンテキストに応じた適切なコンテナを生成
- DomDiffer basic-replacement.test.tsのテストケースリファクタリング
  - 'Simple Element Replacement'以外のテストケースをarrange/act/assert共通化
  - テスト配列化のコード規約に沿って「Standard Replacement Cases」として統一
- 既存のEnhancedHtmlReplacerテストケースの期待値修正
  - Table関連テストケースの期待値をTable要素の正しい構造保持に合わせて更新

### 修正したファイル
- `src/domain/entities/ReplaceElementPreservingState.ts` - Table要素用HTMLパーサー機能追加
- `tests/unit/domain/entities/DomDiffer/basic-replacement.test.ts` - テストケースリファクタリング
- `tests/unit/domain/entities/EnhancedHtmlReplacer/normal-cases.test.ts` - Table関連テストケース期待値修正
- `docs/issue-141/daily-scrum-05/DAILY_SCRUM-05.md` - 作業実績記録

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->


### 本issueの対象外とする課題


### スクラム-05(01回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md -->
ありがとうございます。
自動テスト、実際の動作確認ともに問題ないことを確認しました。

それでここからはリファクタリングの話になるのですが、
今回追加した修正は、テーブル要素のために、親要素的コンテナを用意する実装と理解しています。
ただこれは、htmlの仕様に基づくものであり、他にも同様のケースが存在する可能性があります。
例えば、リスト要素（ul, ol, li）や、セクショナル要素（section, article, navなど）も、
それぞれ特定の親子関係を持っています。
言い換えれば、今回のロジックは`置換前`で指定された要素のタグ名ごとにその親要素ありきでないと
適切なコンテナを生成できないということになります。

現在の置換ロジックは大まかに、`findMatchingElementsWithPattern`で対象要素を`MatchingElement`として特定し、それらに対して`createAppropriateParserContainer`で親要素を決定して、置換前後の要素の入れ替えを行っています。
(この時点で認識に齟齬があればご指摘ください)

ただ親要素は、対象要素が特定できた時点で、その要素のタグ名を参照して決定できるはずです。
したがって、`MatchingElement`に親要素情報を持たせる形にすれば、
`createAppropriateParserContainer`でのタグ名判定を不要にできるのではないかと考えています。
あるいは、対象要素が特定できた時点で、置換前後の要素の入れ替えを行う形にすれば、
親要素の決定ロジック自体を不要にできるかもしれません。

このあたりのリファクタリングについて、ご意見をいただけますでしょうか。(まだ検討段階のため、実際の修正作業には入らないでください。)

---