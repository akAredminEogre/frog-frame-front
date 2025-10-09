import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';
import { Tab } from 'src/domain/value-objects/Tab';

interface RewriteRuleData {
  oldString: string;
  newString: string;
  urlPattern?: string;
  isRegex?: boolean;
}

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
    private repository: IRewriteRuleRepository,
    private currentTabService: ICurrentTabService,
    private chromeRuntimeService: IChromeRuntimeService
  ) {}

  async execute(rewriteRuleData: RewriteRuleData): Promise<SaveRewriteRuleAndApplyResult> {
    try {
      await this.saveRule(rewriteRuleData);
      return await this.applyRuleToCurrentTab();
    } catch (error) {
      console.error('SaveRewriteRuleAndApplyToCurrentTabUseCase error:', error);
      return this.createErrorResult('保存に失敗しました。');
    }
  }

  private async saveRule(rewriteRuleData: RewriteRuleData): Promise<RewriteRule> {
    const rule = new RewriteRule(
      crypto.randomUUID(),
      rewriteRuleData.oldString,
      rewriteRuleData.newString,
      rewriteRuleData.urlPattern || '',
      rewriteRuleData.isRegex || false
    );
    
    await this.repository.set(rule);
    return rule;
  }

  private async applyRuleToCurrentTab(): Promise<SaveRewriteRuleAndApplyResult> {
    try {
      const currentTab = await this.currentTabService.getCurrentTab();
      return await this.processRuleApplication(currentTab);
    } catch (error) {
      console.error('Failed to get current tab:', error);
      return this.createErrorResult('現在のタブを取得できませんでした。');
    }
  }

  private async processRuleApplication(currentTab: Tab): Promise<SaveRewriteRuleAndApplyResult> {

    const applyResult = await this.chromeRuntimeService.sendApplyRewriteRuleMessage(currentTab);
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
