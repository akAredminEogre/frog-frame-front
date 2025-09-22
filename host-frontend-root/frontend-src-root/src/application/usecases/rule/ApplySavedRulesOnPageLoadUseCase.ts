import { HtmlReplacer } from 'src/domain/entities/HtmlReplacer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

export class ApplySavedRulesOnPageLoadUseCase {
  private replacer: HtmlReplacer;

  constructor() {
    this.replacer = new HtmlReplacer();
  }

  /**
   * ストレージに保存されている全てのルールを取得して適用する
   */
  async applyAllRules(targetElement: Element = document.body): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (items) => {
        if (chrome.runtime.lastError) {
          resolve();
          return;
        }

        const rewriteRules = Object.values(items);
        if (!rewriteRules.length) {
          resolve();
          return;
        }

        rewriteRules.forEach((ruleObj) => {
          if (!ruleObj || typeof ruleObj !== 'object') return;
          
          // プレーンオブジェクトをRewriteRuleインスタンスに変換
          const plainRule = ruleObj as {
            id: string;
            oldString: string;
            newString: string;
            urlPattern?: string;
            isRegex?: boolean;
          };
          
          if (!plainRule.oldString || !plainRule.newString) return;
          
          const id = plainRule.id;
          const oldString = plainRule.oldString;
          const newString = plainRule.newString;
          const urlPattern = plainRule.urlPattern;
          const isRegex = plainRule.isRegex;
          const rule = new RewriteRule(id, oldString, newString, urlPattern, isRegex);

          // URLパターンをチェック
          if (rule.urlPattern) {
            const currentUrl = window.location.href;
            if (!currentUrl.startsWith(rule.urlPattern)) {
              return;
            }
          }

          this.replacer.replace(targetElement, rule);
        });

        resolve();
      });
    });
  }
}
