import { injectable } from 'tsyringe';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

/**
 * Chrome Tabs APIを使用して現在のタブにメッセージを送信するサービスの実装
 */
@injectable()
export class ChromeTabsService implements IChromeTabsService {
  async sendMessage(currentTab: CurrentTab, message: any): Promise<any> {
    try {
      const tabId = currentTab.tabId;
      
      const response = await chrome.tabs.sendMessage(tabId, message);
      return response;
    } catch (error) {
      console.error('[ChromeTabsService] sendMessage error:', error);
      throw error;
    }
  }
}
