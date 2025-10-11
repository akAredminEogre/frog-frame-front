import { injectable, inject } from 'tsyringe';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRuleParams } from 'src/application/types/RewriteRuleParams';
import { Tab } from 'src/domain/value-objects/Tab';
import { Tabs } from 'src/domain/value-objects/Tabs';

@injectable()
export class UpdateRewriteRuleUseCase {
  constructor(
    @inject('IRewriteRuleRepository')
    private readonly rewriteRuleRepository: IRewriteRuleRepository,
    @inject('IChromeTabsService')
    private readonly chromeTabsService: IChromeTabsService
  ) {}

  async execute(
    id: string,
    params: RewriteRuleParams
  ): Promise<void> {
    const rule = RewriteRule.fromParams(id, params);
    await this.rewriteRuleRepository.set(rule);

    // ルール更新後、該当タブの内容を更新(失敗してもルール保存は成功)
    try {
      await this.refreshAllTabsAfterRuleUpdate(id, params);
    } catch (refreshError) {
      console.warn('Failed to refresh tabs, but rule was saved successfully:', refreshError);
    }
  }

  /**
   * ルール更新後に該当タブの内容を更新する
   */
  private async refreshAllTabsAfterRuleUpdate(
    id: string,
    params: RewriteRuleParams
  ): Promise<void> {
    // 早期リターン: urlPatternが空文字列やundefinedの場合
    if (!params.urlPattern) {
      return;
    }

    const rule = RewriteRule.fromParams(id, params);

    // 全タブを取得してアプリケーション層でフィルタリング
    const tabs = await this.chromeTabsService.queryTabs({});
    const targetTabs = tabs.filterByRule(rule);
    await this.sendMessageToTabs(targetTabs);
  }

  private async sendMessageToTabs(tabs: Tabs): Promise<void> {
    for (const tab of tabs.toArray()) {
      await this.sendMessageToTab(tab);
    }
  }

  private async sendMessageToTab(tab: Tab): Promise<void> {
    try {
      await this.chromeTabsService.sendApplyAllRulesMessage(tab);
    } catch (error) {
      console.debug('[UpdateRewriteRuleUseCase] Failed to send message to tab:', tab.getTabId().value, error);
    }
  }
}
