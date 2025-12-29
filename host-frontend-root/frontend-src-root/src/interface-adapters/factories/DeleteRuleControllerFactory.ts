import { DeleteRuleInteractor } from 'src/application-business-rules/interactors/DeleteRuleInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { DeleteRuleController } from 'src/interface-adapters/controllers/DeleteRuleController';
import { IDeleteRuleController } from 'src/interface-adapters/controllers/IDeleteRuleController';
import {
  DeleteErrorCallback,
  DeleteSuccessCallback,
  IDeleteRuleControllerFactory,
} from 'src/interface-adapters/factories/IDeleteRuleControllerFactory';
import { DeleteRulePresenter } from 'src/interface-adapters/presenters/DeleteRulePresenter';

/**
 * DeleteRuleControllerを生成するFactory
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export class DeleteRuleControllerFactory implements IDeleteRuleControllerFactory {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly tabsGateway: ITabsGateway
  ) {}

  create(onSuccess: DeleteSuccessCallback, onError: DeleteErrorCallback): IDeleteRuleController {
    const presenter = new DeleteRulePresenter(onSuccess, onError);
    const interactor = new DeleteRuleInteractor(this.repository, this.tabsGateway, presenter);
    return new DeleteRuleController(interactor);
  }
}
