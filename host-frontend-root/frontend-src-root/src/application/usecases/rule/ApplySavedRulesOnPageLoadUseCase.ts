import { HtmlReplacer } from 'src/domain/entities/HtmlReplacer';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';

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
      console.log('[ApplySavedRulesOnPageLoadUseCase] applyAllRules started', {
        targetElement: !!targetElement,
        targetElementTagName: targetElement?.tagName,
        currentUrl,
        repositoryType: this.repository.constructor.name
      });
      
      // リポジトリを使用してルール集合を取得
      console.log('[ApplySavedRulesOnPageLoadUseCase] Calling repository.getAll()');
      const rewriteRules = await this.repository.getAll();
      
      console.log('[ApplySavedRulesOnPageLoadUseCase] repository.getAll() completed', {
        rulesCount: rewriteRules.toArray().length,
        rules: rewriteRules.toArray().map(rule => ({
          id: rule.id,
          oldString: rule.oldString,
          newString: rule.newString,
          urlPattern: rule.urlPattern,
          isRegex: rule.isRegex
        }))
      });
      
      // RewriteRulesオブジェクトから各ルールを処理
      rewriteRules.toArray().forEach((rule, index) => {
        console.log(`[ApplySavedRulesOnPageLoadUseCase] Processing rule ${index + 1}/${rewriteRules.toArray().length}`, {
          ruleId: rule.id,
          oldString: rule.oldString,
          newString: rule.newString,
          urlPattern: rule.urlPattern,
          isRegex: rule.isRegex,
          currentUrl
        });
        
        // URLパターンをチェック
        if (rule.urlPattern) {
          if (!currentUrl.startsWith(rule.urlPattern)) {
            console.log(`[ApplySavedRulesOnPageLoadUseCase] Rule ${index + 1} skipped - URL pattern mismatch`, {
              ruleUrlPattern: rule.urlPattern,
              currentUrl,
              match: false
            });
            return;
          } else {
            console.log(`[ApplySavedRulesOnPageLoadUseCase] Rule ${index + 1} URL pattern matched`, {
              ruleUrlPattern: rule.urlPattern,
              currentUrl,
              match: true
            });
          }
        } else {
          console.log(`[ApplySavedRulesOnPageLoadUseCase] Rule ${index + 1} has no URL pattern - will apply to all pages`);
        }

        console.log(`[ApplySavedRulesOnPageLoadUseCase] Applying rule ${index + 1} with replacer`);
        this.replacer.replace(targetElement, rule);
        console.log(`[ApplySavedRulesOnPageLoadUseCase] Rule ${index + 1} applied successfully`);
      });
      
      console.log('[ApplySavedRulesOnPageLoadUseCase] All rules processed successfully');
    } catch (error) {
      // エラーが発生しても処理を続行（ログ出力などは必要に応じて追加）
      console.error('[ApplySavedRulesOnPageLoadUseCase] Error applying saved rules:', error);
    }
  }
}
