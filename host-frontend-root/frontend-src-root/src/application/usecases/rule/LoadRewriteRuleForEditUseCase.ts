import { injectable, inject } from 'tsyringe';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

@injectable()
export class LoadRewriteRuleForEditUseCase {
  constructor(
    @inject('IRewriteRuleRepository')
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  ) {}

  async execute(ruleId: string): Promise<RewriteRule> {
    return await this.rewriteRuleRepository.getById(ruleId);
  }
}
