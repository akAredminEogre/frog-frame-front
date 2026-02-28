import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { IImportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IImportRulesJsonUseCase';
import { IByteSizeCalculator } from 'src/application-business-rules/ports/services/IByteSizeCalculator';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IImportRulesJsonController } from 'src/interface-adapters/controllers/IImportRulesJsonController';

/**
 * ルールJSONインポートのController
 * CA準拠: ファイル読み取り・バイト数計算はF&D層（IFileTextReader, IByteSizeCalculator）を介して実施し、
 * Use-case層へはjsonString + byteSizeを渡す。サイズバリデーションはInteractor以降で行う。
 */
export class ImportRulesJsonController implements IImportRulesJsonController {
  constructor(
    private readonly useCase: IImportRulesJsonUseCase,
    private readonly fileTextReader: IFileTextReader,
    private readonly byteSizeCalculator: IByteSizeCalculator
  ) {}

  async importRulesJson(file: File): Promise<void> {
    const jsonString = await this.fileTextReader.readAsText(file);
    const byteSize = this.byteSizeCalculator.calculateByteSize(jsonString);
    await this.useCase.importRulesJson(new ImportRulesJsonInputData(jsonString, byteSize));
  }

  async confirmImport(): Promise<void> {
    await this.useCase.confirmImport();
  }
}
