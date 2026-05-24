# 概要
<!-- このチケットで解決したい課題 -->
background.tsでimportされているリスナーをわかるようにしたい

## 背景
frog-frame-front/docs/diagrams/GetElementSelectionUseCase-sequence.puml
のシーケンス図を作成した際に、background.tsでimportされているリスナーがわかりにくかった

例えば
src/infrastructure/browser/listeners/contextMenus/background/onClicked
は、疎結合のため、別ファイルに分かれているが、シーケンス図の概念としてはbackground.tsに含まれている。

このクラスはbackground.ts以外からは利用されるとは考えにくいので、
例えば、
src/infrastructure/browser/listeners/contextMenus/background/onClickedは、
src/infrastructure/browser/background/contextMenus/onClicked
に移動するなどして、background.tsに含まれることを明示したい。

この案をClean Architecture、DDDの観点から議論しながら、ディレクトリ移動、やクラスのリネームについて、最適な方法を検討し、修正していきたい

## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->