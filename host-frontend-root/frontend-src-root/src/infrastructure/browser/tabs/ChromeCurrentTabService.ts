import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { Tab } from 'src/domain/value-objects/Tab';
import { TabId } from 'src/domain/value-objects/TabId';

export class ChromeCurrentTabService implements ICurrentTabService {
  async getCurrentTab(): Promise<Tab> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        try {
          resolve(this.handleTabQueryResult(tabs));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private handleTabQueryResult(tabs: chrome.tabs.Tab[]): Tab {
    const tab = tabs[0];
    if (!tab) {
      throw new Error('No active tab found');
    }

    return this.createCurrentTabFromTab(tab);
  }

  async getTabById(tabId: TabId): Promise<Tab> {
    return new Promise((resolve, reject) => {
      chrome.tabs.get(tabId.value, (tab: chrome.tabs.Tab) => {
        try {
          resolve(this.createCurrentTabFromTab(tab));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private createCurrentTabFromTab(tab: chrome.tabs.Tab): Tab {
    const tabId = tab.id;
    const tabUrl = tab.url;

    if (!tabUrl) {
      throw new Error('No active tab found');
    }

    return new Tab(tabId!, tabUrl);
  }
}
