import { vi } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * RewriteRuleのモックオブジェクトを生成する
 * @param matchingUrls マッチするURLの配列
 * @returns RewriteRule型のモックオブジェクト
 */
export const createMockRule = (matchingUrls: string[]): RewriteRule => {
  return {
    matchesUrl: vi.fn((url: string) => matchingUrls.includes(url)),
  } as unknown as RewriteRule;
};
