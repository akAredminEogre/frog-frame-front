import { container } from 'src/infrastructure/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

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

      // プリミティブ値からCurrentTabインスタンスを作成
      const currentTab = new CurrentTab(tabId);

      // Infrastructure層のサービスを使用してcontent scriptにメッセージを転送
      const chromeTabsService = container.resolve(ChromeTabsService);
      const response = await chromeTabsService.sendMessage(currentTab, { type: 'applyAllRules' });
      
      return { success: true, response };

    } catch (error: any) {
      console.error('[background] applyAllRules error:', error);
      return { success: false, error: error.message };
    }
  },
  ping: async () => ({ pong: true }),
};
