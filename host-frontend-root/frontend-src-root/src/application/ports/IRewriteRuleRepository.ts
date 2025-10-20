import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

export interface IRewriteRuleRepository {
  create(rule: RewriteRule): Promise<void>;
  update(rule: RewriteRule): Promise<void>;
  getAll(): Promise<RewriteRules>;
  getById(id: number): Promise<RewriteRule>;
}
