import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { EnhancedHtmlReplacer } from 'src/domain/entities/EnhancedHtmlReplacer';

export class ApplySavedRulesOnPageLoadUseCase {
  private repository: IRewriteRuleRepository;

  constructor(repository: IRewriteRuleRepository) {
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

        const replacer = new EnhancedHtmlReplacer(targetElement, rule);
        replacer.replace();
      });
    } catch (error) {
      // エラーが発生しても処理を続行（ログ出力などは必要に応じて追加）
      console.error('[ApplySavedRulesOnPageLoadUseCase] Error applying saved rules:', error);
    }
  }
}
