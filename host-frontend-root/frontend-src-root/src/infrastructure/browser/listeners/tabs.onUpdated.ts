
 
export function registerTabsOnUpdated() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.id && tab.url) {
      // content.tsにメッセージを送信して、全ルールの適用を依頼する
      chrome.tabs.sendMessage(tabId, { type: 'applyAllRules' })
        .catch(() => { /* コンテンツスクリプト未注入時のエラーは無視 */ });
    }
  });
}
