import { IWindowService } from 'src/application/ports/IWindowService';

export class ChromeWindowService implements IWindowService {
  async closeCurrentWindow(): Promise<void> {
    const tab = await chrome.tabs.getCurrent();
    if (tab?.id !== undefined) {
      await chrome.tabs.remove(tab.id);
    }
  }
}
