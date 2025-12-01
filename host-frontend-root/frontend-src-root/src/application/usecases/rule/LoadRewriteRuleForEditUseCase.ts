import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

export class LoadRewriteRuleForEditUseCase {
  constructor(
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  ) {}

  async execute(ruleId: number): Promise<RewriteRule> {
    return await this.rewriteRuleRepository.getById(ruleId);
  }
}
