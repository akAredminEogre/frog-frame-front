import { RewriteRule } from 'src/domain/entities/RewriteRule';

export interface IRewriteRuleRepository {
  save(rule: RewriteRule): Promise<void>;
}
