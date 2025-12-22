import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { Tab } from 'src/domain/value-objects/Tab';
import { Tabs } from 'src/domain/value-objects/Tabs';
import { sendToContentScript } from 'src/frameworks-and-drivers/messaging/messaging';

/**
 * Chrome Tabs APIを使用して現在のタブにメッセージを送信するサービスの実装
 * @webext-core/messaging を使用してContent Scriptと通信する
 */
export class ChromeTabsService implements IChromeTabsService {
  async queryTabs(queryInfo: any): Promise<Tabs> {
    try {
      const tabs = await chrome.tabs.query(queryInfo);
      const tabInstances = tabs.map(tab => new Tab(tab.id!, tab.url!));
      return new Tabs(tabInstances);
    } catch (error) {
      console.error('[ChromeTabsService] queryTabs error:', error);
      throw error;
    }
  }

  async sendApplyAllRulesMessage(tab: Tab): Promise<any> {
    try {
      const tabId = tab.getTabId().value;
      const response = await sendToContentScript('applyAllRules', undefined, tabId);
      return response;
    } catch (error) {
      console.error('[ChromeTabsService] sendApplyAllRulesMessage error:', error);
      throw error;
    }
  }

  async sendGetElementSelectionMessage(tabId: number): Promise<{ selection: string }> {
    try {
      const response = await sendToContentScript('getElementSelection', undefined, tabId);
      return response;
    } catch (error) {
      console.error('[ChromeTabsService] sendGetElementSelectionMessage error:', error);
      throw error;
    }
  }

  async openEditPage(ruleId: string): Promise<void> {
    try {
      const url = this.getEditPageUrl(ruleId);
      await this.createTab(url);
    } catch (error) {
      console.error('[ChromeTabsService] openEditPage error:', error);
      throw error;
    }
  }

  private getEditPageUrl(ruleId: string): string {
    return chrome.runtime.getURL(`edit.html?ruleId=${ruleId}`);
  }

  private async createTab(url: string): Promise<void> {
    await chrome.tabs.create({ url });
  }

  async reloadTab(tab: Tab): Promise<void> {
    const tabId = tab.getTabId().value;
    console.log('[ChromeTabsService] reloadTab called', { tabId, tabUrl: tab.getTabUrl().value });
    try {
      await chrome.tabs.reload(tabId);
      console.log('[ChromeTabsService] chrome.tabs.reload succeeded', { tabId });
    } catch (error) {
      console.error('[ChromeTabsService] reloadTab error:', { tabId, error });
      throw error;
    }
  }
}
