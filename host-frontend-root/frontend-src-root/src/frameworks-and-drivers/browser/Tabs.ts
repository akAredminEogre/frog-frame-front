import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * chrome.tabs.Tab[]のファーストクラスコレクション
 * オブジェクト指向9ルールのルール8に準拠
 */
export class Tabs {
  constructor(private readonly tabs: chrome.tabs.Tab[]) {}

  /**
   * 指定されたルールのURLパターンにマッチするタブをフィルタリングする
   * @param rule マッチング判定に使用するRewriteRule
   * @returns マッチするタブのみを含む新しいTabsインスタンス
   */
  filterByRule(rule: RewriteRule): Tabs {
    const filtered = this.tabs.filter(
      (tab) => tab.url !== undefined && rule.matchesUrl(tab.url)
    );
    return new Tabs(filtered);
  }

  /**
   * すべてのタブをリロードする
   */
  async reloadAll(): Promise<void> {
    const reloadPromises = this.tabs.map((tab) => chrome.tabs.reload(tab.id!));
    await Promise.all(reloadPromises);
  }
}
