import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

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

  private filterTargetTabs(tabs: any[], rule: RewriteRule): any[] {
    return tabs.filter(tab => {
      if (!tab.url) {
        return false;
      }
      return rule.matchesUrl(tab.url);
    });
  }

  private async sendMessageToTabs(tabs: any[]): Promise<void> {
    for (const tab of tabs) {
      if (tab.id && tab.url) {
        await this.sendMessageToTab(tab);
      }
    }
  }

  private async sendMessageToTab(tab: any): Promise<void> {
    try {
      await this.chromeTabsService.sendMessage(tab.id, {
        type: 'applyAllRules',
        tabUrl: tab.url
      });
    } catch (error) {
      console.debug('[RefreshAllTabsAfterRuleUpdateUseCase] Failed to send message to tab:', tab.id, error);
    }
  }
}
