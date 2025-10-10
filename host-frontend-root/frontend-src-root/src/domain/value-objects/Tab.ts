import { TabId } from 'src/domain/value-objects/TabId';
import { TabUrl } from 'src/domain/value-objects/TabUrl';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

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

  /**
   * ルールにマッチするかどうかを判定
   */
  matchesRule(rule: RewriteRule): boolean {
    const url = this._tabUrl.value!;
    return rule.matchesUrl(url);
  }
}
