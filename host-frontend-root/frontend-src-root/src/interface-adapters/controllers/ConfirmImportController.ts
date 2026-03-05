import { IConfirmImportUseCase } from 'src/application-business-rules/ports/input/IConfirmImportUseCase';
import { IConfirmImportController } from 'src/interface-adapters/controllers/IConfirmImportController';

/**
 * インポート確定のController
 * 2フェーズ設計: Phase1でpendingRulesがInteractorに保持済み → Phase2はゼロ引数で確定
 */
export class ConfirmImportController implements IConfirmImportController {
  constructor(
    private readonly useCase: IConfirmImportUseCase
  ) {}

  async confirmImport(): Promise<void> {
    await this.useCase.confirmImport();
  }
}
