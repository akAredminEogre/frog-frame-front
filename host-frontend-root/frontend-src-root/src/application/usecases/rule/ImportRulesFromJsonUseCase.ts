import { inject, injectable } from 'tsyringe';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ExportedRewriteRules } from 'src/application/types/ExportedRewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { InvalidImportDataError } from 'src/domain/errors/InvalidImportDataError';

@injectable()
export class ImportRulesFromJsonUseCase {
  constructor(
    @inject('IRewriteRuleRepository')
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  ) {}

  async execute(jsonString: string): Promise<void> {
    const importData = this.parseAndValidate(jsonString);

    for (const ruleData of importData.rules) {
      const rule = new RewriteRule(
        0,
        ruleData.oldString,
        ruleData.newString,
        ruleData.urlPattern,
        ruleData.isRegex,
        ruleData.isActive
      );

      await this.rewriteRuleRepository.create(rule);
    }
  }

  private parseAndValidate(jsonString: string): ExportedRewriteRules {
    let parsed: unknown;

    try {
      parsed = JSON.parse(jsonString);
    } catch {
      throw new InvalidImportDataError('Invalid JSON format');
    }

    if (typeof parsed !== 'object' || parsed === null) {
      throw new InvalidImportDataError('JSON must be an object');
    }

    const data = parsed as Record<string, unknown>;

    if (!('version' in data)) {
      throw new InvalidImportDataError('Missing required field: version');
    }

    if (!('rules' in data)) {
      throw new InvalidImportDataError('Missing required field: rules');
    }

    if (!Array.isArray(data.rules)) {
      throw new InvalidImportDataError('Field "rules" must be an array');
    }

    for (let i = 0; i < data.rules.length; i++) {
      this.validateRule(data.rules[i], i);
    }

    return data as unknown as ExportedRewriteRules;
  }

  private validateRule(rule: unknown, index: number): void {
    if (typeof rule !== 'object' || rule === null) {
      throw new InvalidImportDataError(
        `Rule at index ${index} must be an object`
      );
    }

    const ruleObj = rule as Record<string, unknown>;

    const requiredFields = [
      'oldString',
      'newString',
      'urlPattern',
      'isRegex',
      'isActive',
    ];

    for (const field of requiredFields) {
      if (!(field in ruleObj)) {
        throw new InvalidImportDataError(
          `Rule at index ${index}: Missing required field "${field}"`
        );
      }
    }

    if (typeof ruleObj.oldString !== 'string') {
      throw new InvalidImportDataError(
        `Rule at index ${index}: Field "oldString" must be a string`
      );
    }

    if (typeof ruleObj.newString !== 'string') {
      throw new InvalidImportDataError(
        `Rule at index ${index}: Field "newString" must be a string`
      );
    }

    if (typeof ruleObj.urlPattern !== 'string') {
      throw new InvalidImportDataError(
        `Rule at index ${index}: Field "urlPattern" must be a string`
      );
    }

    if (typeof ruleObj.isRegex !== 'boolean') {
      throw new InvalidImportDataError(
        `Rule at index ${index}: Field "isRegex" must be a boolean`
      );
    }

    if (typeof ruleObj.isActive !== 'boolean') {
      throw new InvalidImportDataError(
        `Rule at index ${index}: Field "isActive" must be a boolean`
      );
    }
  }
}
