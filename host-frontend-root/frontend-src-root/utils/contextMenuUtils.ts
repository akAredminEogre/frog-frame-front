/**
 * コンテキストメニュー「このテキストを置換」がクリックされたときの処理
 * @param selectionText 選択されたテキスト
 */
export const handleReplaceTextClick = (selectionText?: string) => {
  if (selectionText) {
    // 選択したテキストを一時的にストレージに保存
    chrome.storage.local.set({ tempSelectedText: selectionText }, () => {
      // ポップアップを開く
      chrome.action.openPopup();
    });
  }
};

// E2Eテスト用：Service Workerのグローバルスコープに関数を公開
// これにより、background.evaluate() 内から直接呼び出し可能になる
if (typeof globalThis !== 'undefined') {
  (globalThis as any).handleReplaceTextClick = handleReplaceTextClick;
}
