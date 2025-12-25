import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';
import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { RewriteRuleParams } from 'src/application/types/RewriteRuleParams';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

interface SaveRewriteRuleAndApplyResult {
  success: boolean;
  message: string;
  shouldResetForm: boolean;
}

/**
 * リライトルールを保存し、現在のタブに適用するUseCase
 */
export class SaveRewriteRuleAndApplyToCurrentTabUseCase {
  constructor(
    private rewriteRuleRepository: IRewriteRuleRepository,
    private currentTabService: ICurrentTabService,
    private chromeRuntimeService: IChromeRuntimeService
  ) {}

  async execute(params: RewriteRuleParams): Promise<SaveRewriteRuleAndApplyResult> {
    try {
      await this.saveRule(params);
      return await this.applyRuleToCurrentTab();
    } catch (error) {
      console.error('SaveRewriteRuleAndApplyToCurrentTabUseCase error:', error);
      return this.createErrorResult('保存に失敗しました。');
    }
  }

  private async saveRule(params: RewriteRuleParams): Promise<RewriteRule> {
    const rule = RewriteRule.fromParams(Date.now(), params);
    await this.rewriteRuleRepository.create(rule);
    return rule;
  }

  private async applyRuleToCurrentTab(): Promise<SaveRewriteRuleAndApplyResult> {
    try {
      const currentTab = await this.currentTabService.getCurrentTab();
      const tabId = currentTab.getTabId().value;
      const tabUrl = currentTab.getTabUrl().value!;
      return await this.processRuleApplication(tabId, tabUrl);
    } catch (error) {
      console.error('Failed to get current tab:', error);
      return this.createErrorResult('現在のタブを取得できませんでした。');
    }
  }

  private async processRuleApplication(tabId: number, tabUrl: string): Promise<SaveRewriteRuleAndApplyResult> {

    const applyResult = await this.chromeRuntimeService.sendApplyRewriteRuleMessage(tabId, tabUrl);
    if (!applyResult.success) {
      return this.createSuccessResult('保存しましたが、適用に失敗しました。', true);
    }

    return this.createSuccessResult('保存して適用しました！', true);
  }

  private createSuccessResult(message: string, shouldResetForm: boolean): SaveRewriteRuleAndApplyResult {
    return {
      success: true,
      message,
      shouldResetForm
    };
  }

  private createErrorResult(message: string): SaveRewriteRuleAndApplyResult {
    return {
      success: false,
      message,
      shouldResetForm: false
    };
  }
}
