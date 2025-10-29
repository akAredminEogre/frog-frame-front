# 概要
<!-- このチケットで解決したい課題 -->
GetElementSelectionUseCaseは初期に実装されたもののため、現在の設計方針に合わない部分がある。
そのため、UseCaseの設計方針に合わせてリファクタリングを行う。
- [ ] GetElementSelectionUseCaseはgetElementSelectionHandlerで new するのではなく、DIで注入する
- [ ] selectionServiceも、@injectで注入する
- [ ] getElementSelectionInfoのメソッド名をexecuteに変更する
- [ ] 返り値の型を同じファイル内にinterfaceとして定義する




## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->