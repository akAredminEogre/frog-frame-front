
 
export function registerTabsOnUpdated() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
      // content.tsにメッセージを送信して、全ルールの適用を依頼する
      // 一旦Message Handlersで受信される
      chrome.tabs.sendMessage(tabId, { type: 'applyAllRules' })
        .catch(() => { /* コンテンツスクリプト未注入時のエラーは無視 */ });
    }
  });
}
