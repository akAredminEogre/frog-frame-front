import { container } from 'src/infrastructure/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { Tab } from 'src/domain/value-objects/Tab';

type Message =
  | { type: 'applyAllRules'; tabId: number; tabUrl: string }
  | { type: 'ping' };

/**
 * Message handlers using tsyringe DI container
 * sendMessageの受信側であるcontent scriptにメッセージを転送する
 */
export const handlers = {
  applyAllRules: async (msg: Extract<Message, { type: 'applyAllRules' }>) => {
    try {
      const { tabId, tabUrl } = msg;

      // Infrastructure層のサービスを使用してcontent scriptにメッセージを転送
      const chromeTabsService = container.resolve(ChromeTabsService);
      const tab = new Tab(tabId, tabUrl);
      const response = await chromeTabsService.sendApplyAllRulesMessage(tab);
      
      return { success: true, response };

    } catch (error: any) {
      console.error('[background] applyAllRules error:', error);
      return { success: false, error: error.message };
    }
  },
  ping: async () => ({ pong: true }),
};
