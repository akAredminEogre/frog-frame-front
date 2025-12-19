import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * Chrome Tabs APIを使用したGateway実装
 */
export class ChromeTabsGateway implements ITabsGateway {
  /**
   * 指定されたルールのURLパターンにマッチするタブをリロードする
   * @param rule マッチング判定に使用するRewriteRule
   */
  async reloadMatchingTabs(rule: RewriteRule): Promise<void> {
    const tabs = await chrome.tabs.query({});
    const reloadPromises = tabs
      .filter((tab) => tab.url !== undefined && rule.matchesUrl(tab.url))
      .map((tab) => chrome.tabs.reload(tab.id!));
    await Promise.all(reloadPromises);
  }
}
