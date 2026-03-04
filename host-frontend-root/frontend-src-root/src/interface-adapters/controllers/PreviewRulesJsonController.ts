import { PreviewRulesJsonInputData } from 'src/application-business-rules/dto/input/PreviewRulesJsonInputData';
import { IPreviewRulesJsonUseCase } from 'src/application-business-rules/ports/input/IPreviewRulesJsonUseCase';
import { IPreviewRulesJsonController } from 'src/interface-adapters/controllers/IPreviewRulesJsonController';

/**
 * ルールJSONプレビューのController
 * CA準拠: Controller は File をそのまま InputData に包んで UseCase に渡す
 */
export class PreviewRulesJsonController implements IPreviewRulesJsonController {
  constructor(
    private readonly useCase: IPreviewRulesJsonUseCase
  ) {}

  async previewRulesJson(file: File): Promise<void> {
    await this.useCase.previewRulesJson(new PreviewRulesJsonInputData(file));
  }
}
