import { ConfirmImportInteractor } from 'src/application-business-rules/interactors/ConfirmImportInteractor';
import { PreviewRulesJsonInteractor } from 'src/application-business-rules/interactors/PreviewRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { ConfirmImportController } from 'src/interface-adapters/controllers/ConfirmImportController';
import { IConfirmImportController } from 'src/interface-adapters/controllers/IConfirmImportController';
import { IPreviewRulesJsonController } from 'src/interface-adapters/controllers/IPreviewRulesJsonController';
import { PreviewRulesJsonController } from 'src/interface-adapters/controllers/PreviewRulesJsonController';
import {
  IImportRulesJsonControllerFactory,
  ImportErrorCallback,
  ImportSuccessCallback,
  PreviewCallback,
} from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';
import { ConfirmImportPresenter } from 'src/interface-adapters/presenters/ConfirmImportPresenter';
import { PreviewRulesJsonPresenter } from 'src/interface-adapters/presenters/PreviewRulesJsonPresenter';

/**
 * Preview/Confirm 2コントローラーを生成するFactory
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export class ImportRulesJsonControllerFactory implements IImportRulesJsonControllerFactory {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly jsonParser: IJsonParser,
    private readonly fileTextReader: IFileTextReader
  ) {}

  create(
    onPreview: PreviewCallback,
    onSuccess: ImportSuccessCallback,
    onError: ImportErrorCallback
  ): {
    previewController: IPreviewRulesJsonController;
    confirmController: IConfirmImportController;
  } {
    const previewPresenter = new PreviewRulesJsonPresenter(onPreview, onError);
    const previewInteractor = new PreviewRulesJsonInteractor(
      this.repository,
      previewPresenter,
      this.jsonParser,
      this.fileTextReader
    );
    const previewController = new PreviewRulesJsonController(previewInteractor);

    const confirmPresenter = new ConfirmImportPresenter(onSuccess, onError);
    const confirmInteractor = new ConfirmImportInteractor(this.repository, confirmPresenter);
    const confirmController = new ConfirmImportController(confirmInteractor);

    return { previewController, confirmController };
  }
}
