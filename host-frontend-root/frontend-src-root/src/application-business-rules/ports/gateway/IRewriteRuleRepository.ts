import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

export interface IRewriteRuleRepository {
  create(rule: RewriteRule): Promise<void>;
  update(rule: RewriteRule): Promise<void>;
  delete(id: number): Promise<void>;
  getAll(): Promise<RewriteRules>;
  getById(id: number): Promise<RewriteRule>;
  getRulesMatchingUrl(currentUrl: string): Promise<RewriteRules>;
  /** 全ルールをアトミックに置換する（既存ルール全削除 → 新規ルール全作成）。トランザクション保護付き。 */
  replaceAll(rules: RewriteRule[]): Promise<void>;
}
