import { onBackgroundMessage } from 'src/frameworks-and-drivers/messaging/messaging';
import { applyAllRulesHandler } from 'src/infrastructure/browser/handlers/background/applyAllRulesHandler';
import { getAllRewriteRulesHandler } from 'src/infrastructure/browser/handlers/background/getAllRewriteRulesHandler';

/**
 * 呼び出し元: entrypoints/background.ts
 *
 * @webext-core/messaging を使用してメッセージハンドラーを登録する
 * 従来の chrome.runtime.onMessage.addListener から移行
 */
export function runtimeOnMessageReceived() {
  // getAllRules: Content Script → Background
  onBackgroundMessage('getAllRules', async () => {
    return getAllRewriteRulesHandler();
  });

  // applyAllRules: Popup → Background
  onBackgroundMessage('applyAllRules', async (message) => {
    return applyAllRulesHandler({
      type: 'applyAllRules',
      tabId: message.data.tabId,
      tabUrl: message.data.tabUrl,
    });
  });
}
