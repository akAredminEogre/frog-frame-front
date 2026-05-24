import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

export class GetAllRewriteRulesUseCase {
  constructor(
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  ) {}

  async execute(): Promise<RewriteRule[]> {
    const rewriteRules = await this.rewriteRuleRepository.getAll();
    return rewriteRules.toArray();
  }
}
