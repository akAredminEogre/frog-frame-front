import { DeleteRuleInputData } from 'src/application-business-rules/dto/input/DeleteRuleInputData';
import { DeleteRuleErrorOutputData } from 'src/application-business-rules/dto/output/DeleteRuleErrorOutputData';
import { DeleteRuleOutputData } from 'src/application-business-rules/dto/output/DeleteRuleOutputData';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { IDeleteRuleUseCase } from 'src/application-business-rules/ports/input/IDeleteRuleUseCase';
import { IDeleteRulePresenter } from 'src/application-business-rules/ports/output/IDeleteRulePresenter';

/**
 * ルールを削除するInteractor
 * スケルトン実装 - Phase 2で実際のロジックを追加
 */
export class DeleteRuleInteractor implements IDeleteRuleUseCase {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly tabsGateway: ITabsGateway,
    private readonly presenter: IDeleteRulePresenter
  ) {}

  async execute(inputData: DeleteRuleInputData): Promise<void> {
    try {
      // Phase 2で実装予定:
      // 1. ルールを取得（URLパターン取得のため）
      // 2. ルールを削除
      // 3. 成功を通知
      // 4. 該当タブをリロード
      throw new Error(
        `Not implemented: DeleteRuleInteractor.execute, output: ${DeleteRuleOutputData.name}`
      );
    } catch (error) {
      const errorData = new DeleteRuleErrorOutputData(inputData.ruleId, error);
      this.presenter.presentError(errorData);
    }
  }
}
