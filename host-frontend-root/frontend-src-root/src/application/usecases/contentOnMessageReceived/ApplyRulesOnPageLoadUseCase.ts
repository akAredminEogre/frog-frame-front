import { inject, injectable } from 'tsyringe';

import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';

export
@injectable()
class ApplyRulesOnPageLoadUseCase {
  constructor(
    @inject('IRewriteRuleRepository') private repository: IRewriteRuleRepository,
    @inject('ICurrentUrlService') private currentUrlService: ICurrentUrlService
  ) {}

  /**
   * ストレージに保存されている全てのルールを取得して適用する
   */
  async exec(targetElement: Element = document.body): Promise<void> {
    const currentUrl = this.currentUrlService.getCurrentUrl();
    const rewriteRules = await this.repository.getRulesMatchingUrl(currentUrl);

    rewriteRules.applyRulesWithDomDiffer(targetElement);
  }
}
