import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';

/**
 * RewriteRuleのファーストコレクションオブジェクト
 * オブジェクト指向ルール（ThoughtWorksアンソロジー）に従い、プリミティブなコレクションをラップ
 * RewriteRule集合を管理し、追加・削除・検索機能を提供
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
   * ルールを設定した新しいRewriteRulesオブジェクトを返す（Immutable）
   * 既存のIDがある場合は上書き、ない場合は新規追加
   * @param rule 設定するRewriteRule
   * @returns ルールが設定されたRewriteRulesオブジェクト
   */
  set(rule: RewriteRule): RewriteRules {
    const newRules = new Map(this.rules);
    newRules.set(rule.id, rule);
    return new RewriteRules(Object.fromEntries(newRules));
  }

  /**
   * すべてのルールを配列として取得
   * @returns RewriteRuleの配列
   */
  toArray(): RewriteRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * すべてのルールをオブジェクトとして取得
   * @returns RewriteRuleオブジェクトのRecord（キーはrule.id）
   */
  toObject(): Record<string, RewriteRule> {
    return Object.fromEntries(this.rules);
  }

  /**
   * IDで指定されたルールを取得
   * @param id 検索するルールのID
   * @returns 見つかったRewriteRule
   * @throws {RewriteRuleNotFoundError} ルールが見つからない場合
   */
  getById(id: string): RewriteRule {
    const rule = this.rules.get(id);
    if (!rule) {
      throw new RewriteRuleNotFoundError(id);
    }
    return rule;
  }


}
