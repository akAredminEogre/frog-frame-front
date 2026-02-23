import { ExportRulesJsonInputData } from 'src/application-business-rules/dto/input/ExportRulesJsonInputData';
import { IExportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IExportRulesJsonUseCase';
import { IExportRulesJsonController } from 'src/interface-adapters/controllers/IExportRulesJsonController';

/**
 * ルールJSONエクスポートのController
 */
export class ExportRulesJsonController implements IExportRulesJsonController {
  constructor(private readonly useCase: IExportRulesJsonUseCase) {}

  /**
   * ルールをJSON形式でエクスポートする
   */
  async exportRulesJson(): Promise<void> {
    const inputData = new ExportRulesJsonInputData();
    await this.useCase.execute(inputData);
  }
}
