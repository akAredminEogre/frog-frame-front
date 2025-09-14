import { TabId } from 'src/domain/value-objects/TabId';

export class CurrentTab {
  private readonly _tabId: TabId;

  constructor( tabId: number) {
    this._tabId = new TabId(tabId);
  }

  get tabId(): number {
    return this._tabId.value;
  }
}
