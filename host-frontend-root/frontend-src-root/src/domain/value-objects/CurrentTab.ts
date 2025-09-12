import { CurrentUrl } from 'src/domain/value-objects/CurrentUrl';
import { TabId } from 'src/domain/value-objects/TabId';

export class CurrentTab {
  private readonly _tabId: TabId;
  private readonly _currentUrl: CurrentUrl;

  constructor(currentUrl: string, tabId: number) {
    this._currentUrl = new CurrentUrl(currentUrl);
    this._tabId = new TabId(tabId);
  }

  get currentUrl(): string {
    return this._currentUrl.value;
  }

  get tabId(): number {
    return this._tabId.value;
  }
}
