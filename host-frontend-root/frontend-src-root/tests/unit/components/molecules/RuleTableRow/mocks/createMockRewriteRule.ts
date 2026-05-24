/**
 * RuleTableRow テスト用モックRewriteRuleファクトリ
 */
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

interface CreateMockRewriteRuleOptions {
  id?: number;
  oldString?: string;
  newString?: string;
  urlPattern?: string;
  isRegex?: boolean;
  isActive?: boolean;
}

/**
 * テスト用のモックRewriteRuleを作成する
 * @param options オプションでプロパティを上書き可能
 * @returns RewriteRuleインスタンス
 */
export function createMockRewriteRule(
  options: CreateMockRewriteRuleOptions = {}
): RewriteRule {
  return new RewriteRule(
    options.id ?? 1,
    options.oldString ?? 'old-string',
    options.newString ?? 'new-string',
    options.urlPattern ?? 'https://example.com',
    options.isRegex ?? false,
    options.isActive ?? true
  );
}
