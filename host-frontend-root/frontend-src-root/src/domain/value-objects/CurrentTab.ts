import { TabId } from 'src/domain/value-objects/TabId';

export class CurrentTab {
  private readonly _tabId: TabId;

  constructor(tabId: number) {
    // より詳細なバリデーション
    if (tabId === undefined || tabId === null) {
      throw new Error(`CurrentTab constructor received invalid tabId: ${tabId}`);
    }
    
    if (typeof tabId !== 'number') {
      throw new Error(`CurrentTab constructor expected number, but received: ${typeof tabId} (${tabId})`);
    }
    
    try {
      this._tabId = new TabId(tabId);
    } catch (error) {
      throw new Error(`Failed to create TabId: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  get tabId(): number {
    const value = this._tabId?.value;
    if (value === undefined || value === null) {
      throw new Error(`TabId value is unexpectedly ${value}`);
    }
    return value;
  }
}
