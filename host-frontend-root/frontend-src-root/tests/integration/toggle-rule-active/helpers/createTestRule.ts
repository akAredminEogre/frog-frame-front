import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

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
    overrides.id ?? 1,
    overrides.oldString ?? 'oldString',
    overrides.newString ?? 'newString',
    overrides.urlPattern ?? 'https://example.com',
    overrides.isRegex ?? false,
    overrides.isActive ?? true
  );
};
