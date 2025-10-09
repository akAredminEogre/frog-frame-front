import { injectable } from 'tsyringe';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { Tab } from 'src/domain/value-objects/Tab';

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
      return tabs.map(tab => new Tab(tab.id!, tab.url!));
    } catch (error) {
      console.error('[ChromeTabsService] queryTabs error:', error);
      throw error;
    }
  }
}
