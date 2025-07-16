export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // タブの更新（リロードを含む）を監視し、ルールを適用する
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.id && tab.url) {
        // content.tsにメッセージを送信して、全ルールの適用を依頼する
        chrome.tabs.sendMessage(tabId, { type: 'applyAllRules' })
          .catch(() => { /* コンテンツスクリプト未注入時のエラーは無視 */ });
      }
    });

    // ストレージの変更を監視し、アクティブなタブにルールを再適用する
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0];
          if (currentTab && currentTab.id) {
            // アクティブなタブに全ルール適用を依頼
            chrome.tabs.sendMessage(currentTab.id, { type: 'applyAllRules' })
              .catch(() => { /* エラーは無視 */ });
          }
        });
      }
    });

    // Executed when background is loaded, CANNOT BE ASYNC
    // 1) 拡張がインストール or 更新されたタイミングでコンテキストメニューを登録
    chrome.runtime.onInstalled.addListener(() => {
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
          id: 'replace-text',
          parentId: 'favorite-keyword-link-frog-parent',
          title: 'この部分を置換',
          contexts: ['selection'],
        });
      });
    });

    // メッセージリスナーを追加 (ポップアップからのメッセージを受け取る)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // ポップアップからの書き換えルール適用メッセージを受信
      if (request.type === 'applyRewriteRule') {
        // 特定のタブIDが指定されている場合は、そのタブに直接スクリプトを挿入
        if (request.targetTabId) {
          const tabId = request.targetTabId;
          
          // タブ情報を取得
          chrome.tabs.get(tabId, (tab) => {
            if (chrome.runtime.lastError) {
              console.error(`[background] Failed to get tab ${tabId}:`, chrome.runtime.lastError);
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
              return;
            }

            if (!tab.url) {
              console.error(`[background] Tab ${tabId} has no URL`);
              sendResponse({ success: false, error: 'Tab has no URL' });
              return;
            }

            // URLパターンをチェック
            const { urlPattern } = request.rule;
            if (urlPattern && !tab.url.startsWith(urlPattern)) {
              sendResponse({ success: false, reason: 'URL pattern mismatch' });
              return;
            }

            // コンテンツスクリプトにメッセージを送信して、単一ルールの適用を依頼
            chrome.tabs.sendMessage(tabId, { type: 'applySingleRule', rule: request.rule }, (response) => {
              if (chrome.runtime.lastError) {
                console.error(`[background] Failed to send message to tab ${tabId}:`, chrome.runtime.lastError.message);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
                return;
              }
              sendResponse({ success: true, response });
            });
            
            // 非同期応答を使う
            return true;
          });
          
          // 非同期応答を使う
          return true;
        } else {
          // 特定のタブIDが指定されていない場合は、ストレージの変更をトリガーとしてinjectContentScriptsBasedOnRulesが呼ばれるので、
          // ここでは単に成功を返す
          sendResponse({ success: true });
        }
      }
      
      // デフォルトは非同期応答を使わない
      return false;
    });

    // 2) コンテキストメニュークリック時の処理
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === 'replace-text' && tab?.id != null) {
        // content scriptにメッセージを送り、選択範囲のHTMLを取得する
        chrome.tabs.sendMessage(tab.id, { type: 'getSelection' }, (response) => {
          if (chrome.runtime.lastError) {
            // エラー処理
            console.error(chrome.runtime.lastError.message);
            // 選択テキストだけでも処理を続行
            if (info.selectionText) {
              chrome.storage.local.set({ tempSelectedText: info.selectionText }, () => {
                chrome.action.openPopup();
              });
            }
            return;
          }
          
          if (response && response.selection) {
            // 取得したHTMLをストレージに保存してポップアップを開く
            chrome.storage.local.set({ tempSelectedText: response.selection }, () => {
              chrome.action.openPopup();
            });
          }
        });
      }
    });
  },
});
