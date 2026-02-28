import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { IImportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IImportRulesJsonUseCase';
import { IImportRulesJsonController } from 'src/interface-adapters/controllers/IImportRulesJsonController';

/**
 * ルールJSONインポートのController
 * CA準拠: ControllerはFileをそのままInteractorに渡す。
 * ファイルサイズチェック・jsonString取得はInteractor（Use-case層）で実施する。
 */
export class ImportRulesJsonController implements IImportRulesJsonController {
  constructor(
    private readonly useCase: IImportRulesJsonUseCase
  ) {}

  async importRulesJson(file: File): Promise<void> {
    await this.useCase.importRulesJson(new ImportRulesJsonInputData(file));
  }

  async confirmImport(): Promise<void> {
    await this.useCase.confirmImport();
  }
}
