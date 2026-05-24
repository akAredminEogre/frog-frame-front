/**
 * RewriteRuleMapper.toDto - 正常系テスト
 * 1. 全プロパティを持つエンティティからDTOに変換できる（静的メソッド）
 */
import { describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';

describe('RewriteRuleMapper.toDto - 正常系', () => {
  it('全プロパティを持つエンティティからDTOに変換できる', () => {
    // 静的メソッドなのでインスタンス不要
    const entity = RewriteRule.fromParams(1, {
      oldString: 'old text',
      newString: 'new text',
      urlPattern: 'https://example.com',
      isRegex: false,
      isActive: true,
    });

    const result = RewriteRuleMapper.toDto(entity);

    expect(result.id).toBe(1);
    expect(result.oldString).toBe('old text');
    expect(result.newString).toBe('new text');
    expect(result.urlPattern).toBe('https://example.com');
    expect(result.isRegex).toBe(false);
    expect(result.isActive).toBe(true);
  });
});
