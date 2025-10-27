# 概要
<!-- このチケットで解決したい課題 -->
右クリック選択メニューのロジックが散逸しているので統合する
- frog-frame-front/host-frontend-root/frontend-src-root/src/application/ports/ISelectedPageTextService.ts 
  - の内容は、
  - frog-frame-front/host-frontend-root/frontend-src-root/src/application/ports/ISelectedPageTextRepository.ts
  - に移して、ISelectedPageTextServiceは削除する
- frog-frame-front/host-frontend-root/frontend-src-root/src/infrastructure/persistance/storage/SelectedPageTextService.ts
  - も内容を
  - frog-frame-front/host-frontend-root/frontend-src-root/src/infrastructure/persistance/storage/SelectedPageTextRepository.ts
  - に移して、SelectedPageTextServiceは削除
- frog-frame-front/host-frontend-root/frontend-src-root/src/infrastructure/storage/SelectedPageTextRepository.ts
  - は、frog-frame-front/host-frontend-root/frontend-src-root/src/infrastructure/persistance/storage/SelectedPageTextRepository.ts
  - に移動
- ここまでで実装ファイルの整合性は取れるので、あとはそれにあわせて参照を変更。

## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->