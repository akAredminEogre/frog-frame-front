import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * chrome.tabs.Tab[]のファーストクラスコレクション
 * オブジェクト指向9ルールのルール8に準拠
 * URLとIDが存在するタブのみを保持する
 */
export class Tabs {
  private readonly tabs: chrome.tabs.Tab[];

  constructor(chromeTabs: chrome.tabs.Tab[]) {
    this.tabs = chromeTabs.filter((tab) => tab.url !== undefined && tab.id !== undefined);
  }

  /**
   * 指定されたルールのURLパターンにマッチするタブをフィルタリングする
   * @param rule マッチング判定に使用するRewriteRule
   * @returns マッチするタブのみを含む新しいTabsインスタンス
   */
  filterByRule(rule: RewriteRule): Tabs {
    const tabsArray = this.tabs;
    const filtered = tabsArray.filter((tab) => rule.matchesUrl(tab.url!));
    return new Tabs(filtered);
  }

  /**
   * すべてのタブをリロードする
   */
  async reloadAll(): Promise<void> {
    const tabsArray = this.tabs;
    const reloadPromises = tabsArray.map((tab) => chrome.tabs.reload(tab.id!));
    await Promise.all(reloadPromises);
  }
}
