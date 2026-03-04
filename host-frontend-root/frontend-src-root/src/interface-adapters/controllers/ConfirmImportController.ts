import { ConfirmImportInputData } from 'src/application-business-rules/dto/input/ConfirmImportInputData';
import { IConfirmImportUseCase } from 'src/application-business-rules/ports/input/IConfirmImportUseCase';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { IConfirmImportController } from 'src/interface-adapters/controllers/IConfirmImportController';

/**
 * インポート確定のController
 * CA準拠: validatedRules を ConfirmImportInputData にラップして UseCase に委譲する
 */
export class ConfirmImportController implements IConfirmImportController {
  constructor(
    private readonly useCase: IConfirmImportUseCase
  ) {}

  async confirmImport(validatedRules: RewriteRule[]): Promise<void> {
    await this.useCase.confirmImport(new ConfirmImportInputData(validatedRules));
  }
}
