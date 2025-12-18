import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/IToggleRuleActiveUseCase';
import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/IToggleRuleActivePresenter';
import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';

/**
 * ルールの有効/無効を切り替えるInteractor（スケルトン実装）
 */
export class ToggleRuleActiveInteractor implements IToggleRuleActiveUseCase {
  constructor(
    private readonly presenter: IToggleRuleActivePresenter
  ) {}

  async execute(inputData: ToggleRuleActiveInputData): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _presenter = this.presenter;
    throw new Error(`Not implemented: execute with ruleId=${inputData.ruleId}`);
  }
}
