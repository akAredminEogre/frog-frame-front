import { container } from 'src/infrastructure/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

type Message =
  | { type: 'applyAllRules'; currentTab: { tabId: number } }
  | { type: 'ping' };

/**
 * Message handlers using tsyringe DI container
 */
export const handlers = {
  applyAllRules: async (msg: Extract<Message, { type: 'applyAllRules' }>) => {
    try {
      const { currentTab: currentTabData } = msg;

      // 受信したプレーンオブジェクトからCurrentTabインスタンスを作成
      const currentTab = new CurrentTab(currentTabData.tabId);

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
