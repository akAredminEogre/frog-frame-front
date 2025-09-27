import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

export class GetAllRewriteRulesUseCase {
  constructor(
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  ) {}

  async execute(): Promise<RewriteRule[]> {
    const rewriteRules = await this.rewriteRuleRepository.getAll();
    return rewriteRules.toArray();
  }
}
