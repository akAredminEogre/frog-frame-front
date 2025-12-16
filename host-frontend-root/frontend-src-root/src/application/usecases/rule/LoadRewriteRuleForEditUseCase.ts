import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

export class LoadRewriteRuleForEditUseCase {
  constructor(
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  ) {}

  async execute(ruleId: number): Promise<RewriteRule> {
    return await this.rewriteRuleRepository.getById(ruleId);
  }
}
