import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { HtmlReplacer } from 'src/domain/entities/HtmlReplacer';

export class ApplySavedRulesOnPageLoadUseCase {
  private replacer: HtmlReplacer;
  private repository: IRewriteRuleRepository;

  constructor(repository: IRewriteRuleRepository) {
    this.replacer = new HtmlReplacer();
    this.repository = repository;
  }

  /**
   * ストレージに保存されている全てのルールを取得して適用する
   */
  async applyAllRules(targetElement: Element = document.body, currentUrl: string): Promise<void> {
    try {
      // リポジトリを使用してルール集合を取得
      const rewriteRules = await this.repository.getAll();
      
      // RewriteRulesオブジェクトから各ルールを処理
      rewriteRules.toArray().forEach((rule) => {
        // URLパターンをチェック
        if (rule.urlPattern) {
          if (!currentUrl.startsWith(rule.urlPattern)) {
            return;
          }
        }

        this.replacer.replace(targetElement, rule);
      });
    } catch (error) {
      // エラーが発生しても処理を続行（ログ出力などは必要に応じて追加）
      console.error('[ApplySavedRulesOnPageLoadUseCase] Error applying saved rules:', error);
    }
  }
}
