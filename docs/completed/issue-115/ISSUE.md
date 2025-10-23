# 概要
<!-- このチケットで解決したい課題 -->
```
Unused exported class members (3)
set       RewriteRules  src/domain/value-objects/RewriteRules.ts:35:3
toObject  RewriteRules  src/domain/value-objects/RewriteRules.ts:53:3
getById   RewriteRules  src/domain/value-objects/RewriteRules.ts:63:3
```
がでているので対応する。
- まず、プロダクションコード内で、RewriteRules クラスがimportされている箇所を調査する。
  - そのなかで、本当はset, toObject, getByIdで代用できるコードがあれば、それらを使うようにする。
- 上記調査を行っても、プロダクションコード内で使われていないと判断できるメソッドを、削除対象のメソッドとする。
- 次に削除対象のメソッドがテストコード内で使われている場合は、そのコードを削除できないか検討する。
  - テストケースの意義として削除できないと判断する場合は、そのメソッドを使わない、別の書き方に置き換える。
- 最終的に、削除対象のメソッドをコードベースから削除する。
- 確認として、make testlint コマンドを実行し、Unused exported class members 警告の解消、既存テストの全通過を確認する。

## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->