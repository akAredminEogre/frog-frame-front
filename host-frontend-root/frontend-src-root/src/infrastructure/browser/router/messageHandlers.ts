import type { SimpleContainer } from 'src/infrastructure/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

type Message =
  | { type: 'applyAllRules'; currentTab: CurrentTab }
  | { type: 'ping' };

/**
 * @param container 
 * @returns 
 */
export const handlers = (container: SimpleContainer) => ({
  applyAllRules: async (msg: Extract<Message, { type: 'applyAllRules' }>) => {
    try {
      const { currentTab } = msg;

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
});
