import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ToggleRuleActiveInteractor } from 'src/application-business-rules/interactors/ToggleRuleActiveInteractor';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { ToggleRuleActiveController } from 'src/interface-adapters/controllers/ToggleRuleActiveController';
import {
  IToggleRuleActiveControllerFactory,
  ToggleErrorCallback,
  ToggleSuccessCallback,
} from 'src/interface-adapters/factories/IToggleRuleActiveControllerFactory';
import { ToggleRuleActivePresenter } from 'src/interface-adapters/presenters/ToggleRuleActivePresenter';

export class ToggleRuleActiveControllerFactory implements IToggleRuleActiveControllerFactory {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly tabsGateway: ITabsGateway
  ) {}

  create(onSuccess: ToggleSuccessCallback, onError: ToggleErrorCallback): ToggleRuleActiveController {
    const presenter = new ToggleRuleActivePresenter(onSuccess, onError);
    const interactor = new ToggleRuleActiveInteractor(this.repository, this.tabsGateway, presenter);
    return new ToggleRuleActiveController(interactor);
  }
}
