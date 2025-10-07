import { injectable } from 'tsyringe';
import { IChromeTabsService, Tab } from 'src/application/ports/IChromeTabsService';

/**
 * Chrome Tabs APIを使用して現在のタブにメッセージを送信するサービスの実装
 */
@injectable()
export class ChromeTabsService implements IChromeTabsService {
  async sendMessage(tabId: number, message: any): Promise<any> {
    try {
      const response = await chrome.tabs.sendMessage(tabId, message);
      return response;
    } catch (error) {
      console.error('[ChromeTabsService] sendMessage error:', error);
      throw error;
    }
  }

  async queryTabs(queryInfo: any): Promise<Tab[]> {
    try {
      const tabs = await chrome.tabs.query(queryInfo);
      return tabs;
    } catch (error) {
      console.error('[ChromeTabsService] queryTabs error:', error);
      throw error;
    }
  }
}
