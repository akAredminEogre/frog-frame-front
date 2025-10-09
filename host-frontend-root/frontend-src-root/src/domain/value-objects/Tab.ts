import { TabId } from 'src/domain/value-objects/TabId';
import { TabUrl } from 'src/domain/value-objects/TabUrl';

export class Tab {
  private readonly _tabId: TabId;
  private readonly _tabUrl: TabUrl;

  constructor(tabId: number, tabUrl: string) {
    try {
      this._tabId = new TabId(tabId);
      this._tabUrl = new TabUrl(tabUrl);
    } catch (error) {
      throw new Error(`Failed to create Tab: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  getTabId(): TabId {
    return this._tabId;
  }

  getTabUrl(): TabUrl {
    return this._tabUrl;
  }
}
