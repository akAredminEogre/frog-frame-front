import { ConfirmImportInputData } from 'src/application-business-rules/dto/input/ConfirmImportInputData';
import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { StorageImportError } from 'src/application-business-rules/errors/ImportRulesJsonErrors';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IConfirmImportUseCase } from 'src/application-business-rules/ports/input/IConfirmImportUseCase';
import { IConfirmImportPresenter } from 'src/application-business-rules/ports/output/IConfirmImportPresenter';

/**
 * インポート確定のInteractor（ステートレス）
 * Phase 2: validatedRules を受け取り、全件置換して完了を通知する
 */
export class ConfirmImportInteractor implements IConfirmImportUseCase {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly presenter: IConfirmImportPresenter
  ) {}

  async confirmImport(inputData: ConfirmImportInputData): Promise<void> {
    try {
      const currentRules = await this.repository.getAll();
      const previousCount = currentRules.toArray().length;

      await this.repository.replaceAll(inputData.validatedRules);

      this.presenter.present(
        new ImportRulesJsonOutputData(inputData.validatedRules.length, previousCount)
      );
    } catch (error) {
      this.presenter.presentError(
        new ImportRulesJsonErrorOutputData(new StorageImportError(error), 'storage')
      );
    }
  }
}
