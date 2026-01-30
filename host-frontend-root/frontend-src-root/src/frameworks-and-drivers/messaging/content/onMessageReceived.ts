import { applyAllRulesHandler } from 'src/frameworks-and-drivers/messaging/handlers/content/applyAllRulesHandler';
import { getElementSelectionHandler } from 'src/frameworks-and-drivers/messaging/handlers/content/getElementSelectionHandler';
import { onContentScriptMessage } from 'src/frameworks-and-drivers/messaging/messaging';

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * @webext-core/messaging を使用してContent Script用メッセージハンドラーを登録する
 * 従来の chrome.runtime.onMessage.addListener から移行
 */
export function runtimeOnMessageReceived() {
  // applyAllRules: Background → Content Script
  onContentScriptMessage('applyAllRules', async () => {
    return applyAllRulesHandler();
  });

  // getElementSelection: Background → Content Script
  onContentScriptMessage('getElementSelection', async () => {
    return getElementSelectionHandler({ type: 'getElementSelection' });
  });
}
