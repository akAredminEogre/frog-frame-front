import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { Tab } from 'src/domain/value-objects/Tab';

/**
 * ルール更新後に該当タブの内容を更新するユースケース
 */
export class RefreshAllTabsAfterRuleUpdateUseCase {
  constructor(
    private readonly chromeTabsService: IChromeTabsService
  ) {}

  /**
   * 編集されたルールのURLパターンと前方一致するタブに applyAllRules メッセージを送信して、ページ内容を更新する
   */
  async execute(rule: RewriteRule): Promise<void> {
    // 早期リターン: urlPatternが空文字列やundefinedの場合
    if (!rule.urlPattern) {
      return;
    }

    // 全タブを取得してアプリケーション層でフィルタリング
    // Chrome Tabs APIの url パラメータはマッチパターンを使用するため、
    // 単純な前方一致を実現するには全タブを取得してフィルタリングする方が確実
    const tabs = await this.chromeTabsService.queryTabs({});
    const targetTabs = this.filterTargetTabs(tabs, rule);
    await this.sendMessageToTabs(targetTabs);
  }

  private filterTargetTabs(tabs: Tab[], rule: RewriteRule): Tab[] {
    return tabs.filter(tab => {
      const url = tab.getTabUrl().value;
      if (!url) {
        return false;
      }
      return rule.matchesUrl(url);
    });
  }

  private async sendMessageToTabs(tabs: Tab[]): Promise<void> {
    for (const tab of tabs) {
      await this.sendMessageToTab(tab);
    }
  }

  private async sendMessageToTab(tab: Tab): Promise<void> {
    try {
      const tabId = tab.getTabId().value;
      const tabUrl = tab.getTabUrl().value;
      await this.chromeTabsService.sendMessage(tabId, {
        type: 'applyAllRules',
        tabUrl: tabUrl
      });
    } catch (error) {
      console.debug('[RefreshAllTabsAfterRuleUpdateUseCase] Failed to send message to tab:', tab.getTabId().value, error);
    }
  }
}
