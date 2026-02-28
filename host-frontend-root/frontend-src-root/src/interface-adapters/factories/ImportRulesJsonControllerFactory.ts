import { ImportRulesJsonInteractor } from 'src/application-business-rules/interactors/ImportRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IByteSizeCalculator } from 'src/application-business-rules/ports/services/IByteSizeCalculator';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { IImportRulesJsonController } from 'src/interface-adapters/controllers/IImportRulesJsonController';
import { ImportRulesJsonController } from 'src/interface-adapters/controllers/ImportRulesJsonController';
import {
  IImportRulesJsonControllerFactory,
  ImportErrorCallback,
  ImportPreviewCallback,
  ImportSuccessCallback,
} from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';
import { ImportRulesJsonPresenter } from 'src/interface-adapters/presenters/ImportRulesJsonPresenter';

/**
 * ImportRulesJsonControllerを生成するFactory
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export class ImportRulesJsonControllerFactory implements IImportRulesJsonControllerFactory {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly jsonParser: IJsonParser,
    private readonly fileTextReader: IFileTextReader,
    private readonly byteSizeCalculator: IByteSizeCalculator
  ) {}

  create(
    onPreview: ImportPreviewCallback,
    onSuccess: ImportSuccessCallback,
    onError: ImportErrorCallback
  ): IImportRulesJsonController {
    const presenter = new ImportRulesJsonPresenter(onPreview, onSuccess, onError);
    const interactor = new ImportRulesJsonInteractor(this.repository, presenter, this.jsonParser);
    return new ImportRulesJsonController(interactor, this.fileTextReader, this.byteSizeCalculator);
  }
}
