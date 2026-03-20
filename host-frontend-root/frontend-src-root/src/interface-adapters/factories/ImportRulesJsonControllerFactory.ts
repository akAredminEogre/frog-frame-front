import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import {
  IImportRulesJsonPresenter,
  ImportRulesJsonInteractor,
} from 'src/application-business-rules/interactors/ImportRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import {
  IImportRulesJsonController,
  IImportRulesJsonControllerFactory,
  ImportErrorCallback,
  ImportSuccessCallback,
} from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';

/**
 * ImportRulesJsonコントローラーを生成するFactory
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export class ImportRulesJsonControllerFactory implements IImportRulesJsonControllerFactory {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly jsonParser: IJsonParser,
    private readonly fileTextReader: IFileTextReader
  ) {}

  create(
    onSuccess: ImportSuccessCallback,
    onError: ImportErrorCallback
  ): IImportRulesJsonController {
    const presenter: IImportRulesJsonPresenter = {
      present(output: ImportRulesJsonOutputData): void {
        onSuccess(`${output.importedCount}件のルールをインポートしました`);
      },
      presentError(errorData: ImportRulesJsonErrorOutputData): void {
        onError(errorData.message);
      },
    };

    const interactor = new ImportRulesJsonInteractor(
      this.repository,
      presenter,
      this.jsonParser,
      this.fileTextReader
    );

    return {
      importRulesJson: (file: File) => interactor.importRulesJson(new ImportRulesJsonInputData(file)),
    };
  }
}
