import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

export class UpdateRewriteRuleUseCase {
  constructor(
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  ) {}

  async execute(rule: RewriteRule): Promise<void> {
    await this.rewriteRuleRepository.update(rule);
  }
}
