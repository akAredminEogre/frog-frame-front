import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';
import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/IToggleRuleActiveUseCase';

/**
 * ルールの有効/無効切り替えのController
 */
export class ToggleRuleActiveController {
  constructor(
    private readonly useCase: IToggleRuleActiveUseCase
  ) {}

  /**
   * ルールの有効/無効を切り替える
   * @param ruleId ルールID
   */
  async toggleActive(ruleId: number): Promise<void> {
    const inputData = new ToggleRuleActiveInputData(ruleId);
    await this.useCase.execute(inputData);
  }
}
