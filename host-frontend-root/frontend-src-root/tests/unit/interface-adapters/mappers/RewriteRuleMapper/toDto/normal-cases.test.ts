/**
 * RewriteRuleMapper.toDto - 正常系テスト
 * 1. 全プロパティを持つエンティティからDTOに変換できる
 */
import { describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

describe('RewriteRuleMapper.toDto - 正常系', () => {
  it('全プロパティを持つエンティティからDTOに変換できる', () => {
    const mockMessagingPort: IRewriteRuleMessagingPort = {
      getAll: vi.fn(),
      getById: vi.fn(),
      updateActive: vi.fn(),
    };
    const mapper = new RewriteRuleMapper(mockMessagingPort);
    const entity = new RewriteRule(
      1,
      'old text',
      'new text',
      'https://example.com',
      false,
      true
    );

    const result = mapper.toDto(entity);

    expect(result.id).toBe(1);
    expect(result.oldString).toBe('old text');
    expect(result.newString).toBe('new text');
    expect(result.urlPattern).toBe('https://example.com');
    expect(result.isRegex).toBe(false);
    expect(result.isActive).toBe(true);
  });
});
