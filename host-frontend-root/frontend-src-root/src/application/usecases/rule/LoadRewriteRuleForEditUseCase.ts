import { inject,injectable } from 'tsyringe';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

export
@injectable()
class LoadRewriteRuleForEditUseCase {
  constructor(
    @inject('IRewriteRuleRepository')
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  ) {}

  async execute(ruleId: number): Promise<RewriteRule> {
    return await this.rewriteRuleRepository.getById(ruleId);
  }
}
