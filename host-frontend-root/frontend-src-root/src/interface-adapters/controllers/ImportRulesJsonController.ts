import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { IImportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IImportRulesJsonUseCase';
import { IImportRulesJsonController } from 'src/interface-adapters/controllers/IImportRulesJsonController';

/**
 * ルールJSONインポートのController
 */
export class ImportRulesJsonController implements IImportRulesJsonController {
  constructor(private readonly useCase: IImportRulesJsonUseCase) {}

  async importRulesJson(jsonString: string, byteSize: number): Promise<void> {
    await this.useCase.importRulesJson(new ImportRulesJsonInputData(jsonString, byteSize));
  }

  async confirmImport(): Promise<void> {
    await this.useCase.confirmImport();
  }
}
