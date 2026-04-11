import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * テスト用RewriteRuleを生成するヘルパー
 * @param overrides 上書きするプロパティ
 * @returns RewriteRuleインスタンス
 */
export const createTestRule = (overrides: {
  id?: number;
  oldString?: string;
  newString?: string;
  urlPattern?: string;
  isRegex?: boolean;
  isActive?: boolean;
} = {}): RewriteRule => {
  return new RewriteRule(
    createRuleId(overrides.id ?? 1),
    overrides.oldString ?? 'oldString',
    overrides.newString ?? 'newString',
    overrides.urlPattern ?? 'https://example.com',
    overrides.isRegex ?? false,
    overrides.isActive ?? true
  );
};
