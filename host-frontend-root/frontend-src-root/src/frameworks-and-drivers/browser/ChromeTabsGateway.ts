import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { Tabs } from 'src/frameworks-and-drivers/browser/Tabs';

/**
 * Chrome Tabs APIを使用したGateway実装
 */
export class ChromeTabsGateway implements ITabsGateway {
  /**
   * 指定されたルールのURLパターンにマッチするタブをリロードする
   * @param rule マッチング判定に使用するRewriteRule
   */
  async reloadMatchingTabs(rule: RewriteRule): Promise<void> {
    const chromeTabs = await chrome.tabs.query({});
    const tabs = new Tabs(chromeTabs);
    const matchingTabs = tabs.filterByRule(rule);
    await matchingTabs.reloadAll();
  }
}
