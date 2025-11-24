import { inject, injectable } from 'tsyringe';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import {
  ExportedRewriteRule,
  ExportedRewriteRules,
} from 'src/application/types/ExportedRewriteRules';

@injectable()
export class ExportRulesToJsonUseCase {
  constructor(
    @inject('IRewriteRuleRepository')
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  ) {}

  async execute(): Promise<string> {
    const rewriteRules = await this.rewriteRuleRepository.getAll();
    const rulesArray = rewriteRules.toArray();

    const exportedRules: ExportedRewriteRule[] = rulesArray.map((rule) => ({
      oldString: rule.oldString,
      newString: rule.newString,
      urlPattern: rule.urlPattern,
      isRegex: rule.isRegex,
      isActive: rule.isActive,
    }));

    const exportData: ExportedRewriteRules = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      rules: exportedRules,
    };

    return JSON.stringify(exportData, null, 2);
  }
}
