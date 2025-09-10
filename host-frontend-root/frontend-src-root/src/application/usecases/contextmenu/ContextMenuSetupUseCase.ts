export class ContextMenuSetupUseCase {
  /**
   * コンテキストメニューを設定する
   * 拡張機能のインストール時やアップデート時に呼び出される
   */
  execute(): void {
    // 既存のメニューがある場合は衝突を防ぐため removeAll
    chrome.contextMenus.removeAll(() => {
      // 親メニューを作成
      chrome.contextMenus.create({
        id: 'favorite-keyword-link-frog-parent',
        title: 'favorite-keyword-link-frog',
        contexts: ['selection'],
      });
      
      // サブメニューを作成
      chrome.contextMenus.create({
        id: 'context-menu-replace-dom-element',
        parentId: 'favorite-keyword-link-frog-parent',
        title: 'この要素を置換',
        contexts: ['selection'],
      });
    });
  }
}
