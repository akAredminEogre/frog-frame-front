import { DeleteRuleInputData } from 'src/application-business-rules/dto/input/DeleteRuleInputData';
import { DeleteRuleErrorOutputData } from 'src/application-business-rules/dto/output/DeleteRuleErrorOutputData';
import { DeleteRuleOutputData } from 'src/application-business-rules/dto/output/DeleteRuleOutputData';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { IDeleteRuleUseCase } from 'src/application-business-rules/ports/input/IDeleteRuleUseCase';
import { IDeleteRulePresenter } from 'src/application-business-rules/ports/output/IDeleteRulePresenter';

/**
 * ルールを削除するInteractor
 */
export class DeleteRuleInteractor implements IDeleteRuleUseCase {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly tabsGateway: ITabsGateway,
    private readonly presenter: IDeleteRulePresenter
  ) {}

  async execute(deleteRuleInputData: DeleteRuleInputData): Promise<void> {
    try {
      const rule = await this.repository.getById(deleteRuleInputData.ruleId);
      await this.repository.delete(deleteRuleInputData.ruleId);
      const outputData = new DeleteRuleOutputData(deleteRuleInputData.ruleId);
      // 部分的成功パターン: 副次操作（タブリロード）の前にpresentを呼び出すことで、
      // 副次操作が失敗しても主要操作（削除）の成功をUIに反映する
      this.presenter.present(outputData);
      await this.tabsGateway.reloadMatchingTabs(rule);
    } catch (error) {
      const errorData = new DeleteRuleErrorOutputData(deleteRuleInputData.ruleId, error);
      this.presenter.presentError(errorData);
    }
  }
}
