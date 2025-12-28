import { DeleteRuleInputData } from 'src/application-business-rules/dto/input/DeleteRuleInputData';
import { IDeleteRuleUseCase } from 'src/application-business-rules/ports/input/IDeleteRuleUseCase';
import { IDeleteRuleController } from 'src/interface-adapters/controllers/IDeleteRuleController';

/**
 * ルール削除のController
 */
export class DeleteRuleController implements IDeleteRuleController {
  constructor(private readonly useCase: IDeleteRuleUseCase) {}

  /**
   * ルールを削除する
   * @param ruleId ルールID
   */
  async deleteRule(ruleId: number): Promise<void> {
    const inputData = new DeleteRuleInputData(ruleId);
    await this.useCase.execute(inputData);
  }
}
