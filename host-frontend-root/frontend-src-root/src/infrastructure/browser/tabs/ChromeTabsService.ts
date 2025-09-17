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
      
      // tabIdの有効性をチェック
      if (typeof tabId !== 'number' || tabId <= 0) {
        throw new Error(`Invalid tabId: ${tabId}`);
      }
      
      // chrome.tabs.sendMessageを呼び出し（Manifest V3では第3引数optionsは省略可能）
      const response = await chrome.tabs.sendMessage(tabId, message);
      return response;
    } catch (error) {
      console.error('[ChromeTabsService] sendMessage error:', error);
      throw error;
    }
  }
}
