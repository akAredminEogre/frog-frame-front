import { RewriteRuleParams } from 'src/application/types/RewriteRuleParams';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { InvalidRuleIdError } from 'src/enterprise-business-rules/errors/InvalidRuleIdError';

export const MAX_IMPORT_RULES_COUNT = 1000;

/**
 * ルール0件エラー
 */
export class EmptyRulesCollectionError extends Error {
  constructor() {
    super('インポートするルールがありません');
    this.name = 'EmptyRulesCollectionError';
  }
}

/**
 * ルール件数上限超過エラー
 */
export class RulesCollectionCountExceededError extends Error {
  constructor() {
    super(`ルール件数が上限（${MAX_IMPORT_RULES_COUNT}件）を超えています`);
    this.name = 'RulesCollectionCountExceededError';
  }
}

/**
 * インポートルール集合のValue Object
 * コンストラクタで0件チェック・件数上限チェックを行い、
 * RewriteRule[] を構築する。各チェック失敗時は対応するエラーをスローする。
 * 各ルールのフィールドバリデーションは RewriteRule.fromParams() に委譲する。
 */
export class ImportRulesCollection {
  private readonly _rules: RewriteRule[];

  constructor(rawRules: unknown[]) {
    if (rawRules.length === 0) {
      throw new EmptyRulesCollectionError();
    }
    if (rawRules.length > MAX_IMPORT_RULES_COUNT) {
      throw new RulesCollectionCountExceededError();
    }
    this._rules = rawRules.map((raw) => {
      if (typeof raw !== 'object' || raw === null) {
        throw new InvalidRuleIdError(raw);
      }
      const ruleData = raw as Record<string, unknown>;
      return RewriteRule.fromParams(
        ruleData.id,
        ruleData as unknown as RewriteRuleParams
      );
    });
  }

  toArray(): RewriteRule[] {
    return [...this._rules];
  }
}
