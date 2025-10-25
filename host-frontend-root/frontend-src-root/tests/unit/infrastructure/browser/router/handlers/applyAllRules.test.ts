import { container } from 'src/infrastructure/di/container';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { handlers } from 'src/infrastructure/browser/router/messageHandlers';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';

// Chrome APIのモック
const mockChromeTabsService = {
  sendMessage: vi.fn(),
  sendApplyAllRulesMessage: vi.fn()
};

describe('handlers.applyAllRules', () => {
  const tabId = 1;

  beforeEach(() => {
    // モックサービスでオーバーライド
    container.register(ChromeTabsService, { useValue: mockChromeTabsService as any });
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    // 元のサービスを復元
    container.register(ChromeTabsService, { useClass: ChromeTabsService });
  });

  it('正常にapplyAllRulesメッセージを処理する', async () => {
    const expectedResponse = { success: true, data: 'applied' };
    mockChromeTabsService.sendApplyAllRulesMessage.mockResolvedValue(expectedResponse);

    const message = {
      type: 'applyAllRules' as const,
      tabId: tabId,
      tabUrl: 'https://example.com'
    };

    const result = await handlers.applyAllRules(message);

    expect(mockChromeTabsService.sendApplyAllRulesMessage).toHaveBeenCalledTimes(1);
    const callArg = mockChromeTabsService.sendApplyAllRulesMessage.mock.calls[0][0];
    expect(callArg.getTabId().value).toBe(tabId);
    expect(callArg.getTabUrl().value).toBe('https://example.com');
    expect(result).toEqual({
      success: true,
      response: expectedResponse
    });
  });




});
