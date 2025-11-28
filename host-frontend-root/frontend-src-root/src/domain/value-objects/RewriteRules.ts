import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * RewriteRuleのファーストコレクションオブジェクト
 * オブジェクト指向ルール（ThoughtWorksアンソロジー）に従い、プリミティブなコレクションをラップ
 * RewriteRule集合を管理し、配列形式での取得機能を提供
 */
export class RewriteRules {
  private readonly rules: Map<string, RewriteRule>;

  /**
   * RewriteRulesオブジェクトを作成
   * @param rulesObject RewriteRuleオブジェクトのRecord（キーはrule.id）またはプレーンオブジェクト
   */
  constructor(rulesObject: Record<string, RewriteRule | any> = {}) {
    this.rules = new Map(
      Object.entries(rulesObject).map(([id, ruleData]) => {
        // RewriteRuleインスタンスの場合はそのまま使用
        if (ruleData instanceof RewriteRule) {
          return [id, ruleData];
        }
        // プレーンオブジェクトの場合はRewriteRuleインスタンスに復元
        return [id, RewriteRule.fromPlainObject(ruleData)];
      })
    );
  }

  /**
   * すべてのルールを配列として取得
   * @returns RewriteRuleの配列
   */
  toArray(): RewriteRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * URLにマッチするルールをDomDifferで適用する
   * @param currentUrl 現在のURL
   * @param targetElement 適用対象のDOM要素
   */
  applyRulesWithDomDiffer(currentUrl: string, targetElement: Element): void {
    this.toArray().forEach((rule) => {
      if (!rule.matchesUrl(currentUrl)) {
        return;
      }
      const domDiffer = new DomDiffer(targetElement, rule);
      domDiffer.applyRule();
    });
  }

}
