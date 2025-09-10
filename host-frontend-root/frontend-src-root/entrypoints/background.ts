import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { ApplyRewriteRuleToTabUseCase } from 'src/application/usecases/rule/ApplyRewriteRuleToTabUseCase';
import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';

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
      // Application層のUseCaseを使用してコンテキストメニューを設定
      const contextMenuSetupUseCase = new ContextMenuSetupUseCase();
      contextMenuSetupUseCase.execute();
    });

    // メッセージリスナーを追加 (ポップアップからのメッセージを受け取る)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // ポップアップからの書き換えルール適用メッセージを受信
      if (request.type === 'applyRewriteRule') {
        // 特定のタブIDが指定されている場合は、Application層のUseCaseを使用
        if (request.targetTabId) {
          const applyRewriteRuleUseCase = new ApplyRewriteRuleToTabUseCase();
          
          applyRewriteRuleUseCase.execute(request.targetTabId, request.rule)
            .then((result) => {
              sendResponse(result);
            })
            .catch((error) => {
              console.error('[background] ApplyRewriteRuleToTabUseCase error:', error);
              sendResponse({ success: false, error: error.message });
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
    chrome.contextMenus.onClicked.addListener(async (info, tab) => {
      if (info.menuItemId === 'context-menu-replace-dom-element' && tab?.id != null) {
        // Application層のUseCaseを使用してコンテキストメニュー選択処理を実行
        const contextMenuUseCase = new HandleContextMenuReplaceDomElement();
        await contextMenuUseCase.execute(tab.id, info.selectionText);
      }
    });
  },
});
