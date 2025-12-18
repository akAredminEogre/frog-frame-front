import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/IToggleRuleActiveUseCase';

/**
 * ルールの有効/無効切り替えのController（スケルトン実装）
 */
export class ToggleRuleActiveController {
  constructor(
    private readonly useCase: IToggleRuleActiveUseCase
  ) {}

  /**
   * ルールの有効/無効を切り替える
   * @param ruleId ルールID
   * @param active 新しい有効状態
   */
  async toggleRuleActive(ruleId: number, active: boolean): Promise<void> {
    throw new Error('Not implemented');
  }
}
