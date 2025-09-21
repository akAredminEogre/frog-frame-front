import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

export interface IRewriteRuleRepository {
  save(rule: RewriteRule): Promise<void>;
}
