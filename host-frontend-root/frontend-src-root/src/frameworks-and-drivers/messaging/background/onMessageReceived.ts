import { applyAllRulesHandler } from 'src/frameworks-and-drivers/messaging/handlers/background/applyAllRulesHandler';
import { onBackgroundMessage } from 'src/frameworks-and-drivers/messaging/messaging';

/**
 * 呼び出し元: entrypoints/background.ts
 *
 * @webext-core/messaging を使用してメッセージハンドラーを登録する
 * 従来の chrome.runtime.onMessage.addListener から移行
 *
 * Note: getAllRules は @webext-core/proxy-service (RewriteRuleProxyService) に移行済み
 */
export function runtimeOnMessageReceived() {
  // applyAllRules: Popup → Background
  onBackgroundMessage('applyAllRules', async (message) => {
    return applyAllRulesHandler({
      type: 'applyAllRules',
      tabId: message.data.tabId,
      tabUrl: message.data.tabUrl,
    });
  });
}
