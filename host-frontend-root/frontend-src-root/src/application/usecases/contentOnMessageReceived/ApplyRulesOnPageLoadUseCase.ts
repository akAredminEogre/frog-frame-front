import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';

/**
 * Content Script用UseCase - 手動DI解決で使用
 * tsyringeデコレーターを使用しない（バンドラーとの互換性問題を回避）
 */
export class ApplyRulesOnPageLoadUseCase {
  constructor(
    private repository: IRewriteRuleRepository,
    private currentUrlService: ICurrentUrlService
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
