/**
 * RewriteRuleMapper.toEntity - 正常系テスト
 * 1. 全プロパティを持つDTOからエンティティに変換できる
 */
import { describe, expect, it, vi } from 'vitest';

import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

describe('RewriteRuleMapper.toEntity - 正常系', () => {
  it('全プロパティを持つDTOからエンティティに変換できる', () => {
    // toEntityテストではMessagingPortは使用しないためダミーモックを渡す
    const mockMessagingPort: IRewriteRuleMessagingPort = {
      getAll: vi.fn(),
      getById: vi.fn(),
      updateActive: vi.fn(),
    };
    const mapper = new RewriteRuleMapper(mockMessagingPort);
    const dto: RewriteRuleDTO = {
      id: 1,
      oldString: 'old text',
      newString: 'new text',
      urlPattern: 'https://example.com',
      isRegex: false,
      isActive: true,
    };

    const result = mapper.toEntity(dto);

    expect(result.id).toBe(1);
    expect(result.oldString).toBe('old text');
    expect(result.newString).toBe('new text');
    expect(result.urlPattern).toBe('https://example.com');
    expect(result.isRegex).toBe(false);
    expect(result.isActive).toBe(true);
  });
});
