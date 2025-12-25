import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';
import { ToggleRuleActiveErrorOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveErrorOutputData';
import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveOutputData';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/IToggleRuleActiveUseCase';
import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/IToggleRuleActivePresenter';

/**
 * ルールの有効/無効を切り替えるInteractor
 */
export class ToggleRuleActiveInteractor implements IToggleRuleActiveUseCase {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly tabsGateway: ITabsGateway,
    private readonly presenter: IToggleRuleActivePresenter
  ) {}

  async execute(inputData: ToggleRuleActiveInputData): Promise<void> {
    try {
      const rule = await this.repository.getById(inputData.ruleId);
      const toggledRule = rule.withActive(!rule.isActive);
      await this.repository.update(toggledRule);
      const outputData = new ToggleRuleActiveOutputData(toggledRule);
      this.presenter.present(outputData);
      await this.tabsGateway.reloadMatchingTabs(toggledRule);
    } catch (error) {
      const errorData = new ToggleRuleActiveErrorOutputData(inputData.ruleId, error);
      this.presenter.presentError(errorData);
    }
  }
}
