
/**
 * コンテキストメニューからのDOM要素置換処理を扱うユースケース
 */
export class HandleContextMenuReplaceDomElement {
  
  /**
   * コンテキストメニュー選択時の処理
   * @param tabId 対象タブのID
   * @param selectionText 選択されたテキスト（フォールバック用）
   * @returns Promise<void>
   */
  async execute(tabId: number, selectionText?: string): Promise<void> {
    try {
      // content scriptにメッセージを送信して選択要素を取得
      const response = await this.sendMessageToTab(tabId, { type: 'getElementSelection' });
      
      if (response && response.selection) {
        // 取得したHTMLをストレージに保存してポップアップを開く
        await this.saveSelectionAndOpenPopup(response.selection);
      }
    } catch (error) {
      console.error('Failed to get element selection:', error);
      // エラー時は選択テキストでフォールバック
      if (selectionText) {
        await this.saveSelectionAndOpenPopup(selectionText);
      }
    }
  }

  /**
   * タブにメッセージを送信
   */
  private sendMessageToTab(tabId: number, message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(response);
      });
    });
  }

  /**
   * 選択内容をストレージに保存してポップアップを開く
   */
  private saveSelectionAndOpenPopup(selection: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ tempSelectedText: selection }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        chrome.action.openPopup();
        resolve();
      });
    });
  }
}
