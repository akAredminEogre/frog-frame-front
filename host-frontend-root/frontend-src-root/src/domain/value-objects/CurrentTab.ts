import { TabId } from 'src/domain/value-objects/TabId';

export class CurrentTab {
  private readonly _tabId: TabId;

  constructor(tabId: number) {
    try {
      this._tabId = new TabId(tabId);
    } catch (error) {
      throw new Error(`Failed to create TabId: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  get tabId(): number {
    return this._tabId.value;
  }
}
