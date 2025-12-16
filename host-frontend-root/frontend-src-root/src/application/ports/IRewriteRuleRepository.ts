import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

export interface IRewriteRuleRepository {
  create(rule: RewriteRule): Promise<void>;
  update(rule: RewriteRule): Promise<void>;
  getAll(): Promise<RewriteRules>;
  getById(id: number): Promise<RewriteRule>;
  getRulesMatchingUrl(currentUrl: string): Promise<RewriteRules>;
}
