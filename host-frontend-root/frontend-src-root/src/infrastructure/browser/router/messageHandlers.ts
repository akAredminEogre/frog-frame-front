import { container } from 'src/infrastructure/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';

type Message =
  | { type: 'applyAllRules'; tabId: number }
  | { type: 'ping' };

/**
 * Message handlers using tsyringe DI container
 * sendMessageの受信側であるcontent scriptにメッセージを転送する
 */
export const handlers = {
  applyAllRules: async (msg: Extract<Message, { type: 'applyAllRules' }>) => {
    try {
      const { tabId } = msg;

      // Infrastructure層のサービスを使用してcontent scriptにメッセージを転送
      const chromeTabsService = container.resolve(ChromeTabsService);
      const response = await chromeTabsService.sendMessage(tabId, { type: 'applyAllRules' });
      
      return { success: true, response };

    } catch (error: any) {
      console.error('[background] applyAllRules error:', error);
      return { success: false, error: error.message };
    }
  },
  ping: async () => ({ pong: true }),
};
