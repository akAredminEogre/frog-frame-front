import { ExportRulesJsonInteractor } from 'src/application-business-rules/interactors/ExportRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ExportRulesJsonController } from 'src/interface-adapters/controllers/ExportRulesJsonController';
import { IExportRulesJsonController } from 'src/interface-adapters/controllers/IExportRulesJsonController';
import {
  ExportErrorCallback,
  ExportSuccessCallback,
  IExportRulesJsonControllerFactory,
} from 'src/interface-adapters/factories/IExportRulesJsonControllerFactory';
import { ExportRulesJsonPresenter } from 'src/interface-adapters/presenters/ExportRulesJsonPresenter';

/**
 * ExportRulesJsonControllerを生成するFactory
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export class ExportRulesJsonControllerFactory implements IExportRulesJsonControllerFactory {
  constructor(
    private readonly repository: IRewriteRuleRepository
  ) {}

  create(onSuccess: ExportSuccessCallback, onError: ExportErrorCallback): IExportRulesJsonController {
    const presenter = new ExportRulesJsonPresenter(onSuccess, onError);
    const interactor = new ExportRulesJsonInteractor(this.repository, presenter);
    return new ExportRulesJsonController(interactor);
  }
}
