import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

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
 * 必須フィールド欠落エラー
 */
export class RulesCollectionMissingFieldError extends Error {
  constructor(ruleIndex: number) {
    super(`ルール #${ruleIndex}: oldStringが欠落または空白です`);
    this.name = 'RulesCollectionMissingFieldError';
  }
}

/**
 * インポートルール集合のValue Object
 * コンストラクタで0件チェック・件数上限チェック・各ルールの必須フィールド検証を行い、
 * RewriteRule[] を構築する。各チェック失敗時は対応するエラーをスローする。
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
    this._rules = rawRules.map((raw, index) => {
      const ruleData = raw as Record<string, unknown>;
      if (ruleData.oldString === null || ruleData.oldString === undefined || ruleData.oldString === '') {
        throw new RulesCollectionMissingFieldError(index + 1);
      }
      return new RewriteRule(
        typeof ruleData.id === 'number' ? ruleData.id : 0,
        String(ruleData.oldString),
        String(ruleData.newString ?? ''),
        String(ruleData.urlPattern ?? ''),
        typeof ruleData.isRegex === 'boolean' ? ruleData.isRegex : false,
        typeof ruleData.isActive === 'boolean' ? ruleData.isActive : true
      );
    });
  }

  toArray(): RewriteRule[] {
    return this._rules;
  }
}
