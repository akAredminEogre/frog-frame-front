import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';
import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/IToggleRuleActiveUseCase';
import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/IToggleRuleActivePresenter';

/**
 * ルールの有効/無効を切り替えるInteractor（スケルトン実装）
 */
export class ToggleRuleActiveInteractor implements IToggleRuleActiveUseCase {
  constructor(
    private readonly presenter: IToggleRuleActivePresenter
  ) {}

  async execute(inputData: ToggleRuleActiveInputData): Promise<void> {
    throw new Error(`Not implemented: execute with ruleId=${inputData.ruleId}, presenter=${this.presenter.constructor.name}`);
  }
}
