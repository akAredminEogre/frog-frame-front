import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

export class ChromeCurrentTabService implements ICurrentTabService {
  async getCurrentTab(): Promise<CurrentTab> {
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

  private handleTabQueryResult(tabs: chrome.tabs.Tab[]): CurrentTab {
    if (chrome.runtime.lastError) {
      console.error('Failed to get current tab:', chrome.runtime.lastError);
      throw new Error(`Chrome runtime error: ${chrome.runtime.lastError.message}`);
    }

    const tab = tabs[0];
    if (!tab) {
      throw new Error('No active tab found');
    }

    const tabId = tab.id;

    console.log(`[ChromeCurrentTabService] Creating CurrentTab with tabId: ${tabId}`);
    return new CurrentTab(tabId!);
  }
}
