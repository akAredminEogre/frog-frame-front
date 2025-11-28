import { inject, injectable } from 'tsyringe';

import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { DomDiffer } from 'src/domain/entities/DomDiffer';

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
    try {
      const currentUrl = this.currentUrlService.getCurrentUrl();
      const rewriteRules = await this.repository.getAll();

      rewriteRules.toArray().forEach((rule) => {
        // URLがマッチしない場合はスキップ（空のurlPatternは全URLにマッチ）
        if (!rule.matchesUrl(currentUrl)) {
          return;
        }

        const domDiffer = new DomDiffer(targetElement, rule);
        domDiffer.applyRule();
      });
    } catch (error) {
      // エラーが発生しても処理を続行（ログ出力などは必要に応じて追加）
      console.error('[ApplyRulesOnPageLoadUseCase] Error applying saved rules:', error);
    }
  }
}
