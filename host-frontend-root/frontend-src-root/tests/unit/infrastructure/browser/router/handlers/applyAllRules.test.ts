import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { handlers } from 'src/infrastructure/browser/router/messageHandlers';
import { container } from 'src/infrastructure/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';

// Chrome APIのモック
const mockChromeTabsService = {
  sendMessage: vi.fn()
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
    mockChromeTabsService.sendMessage.mockResolvedValue(expectedResponse);

    const message = {
      type: 'applyAllRules' as const,
      tabId: tabId
    };

    const result = await handlers.applyAllRules(message);

    expect(mockChromeTabsService.sendMessage).toHaveBeenCalledWith(
      tabId,
      { type: 'applyAllRules' }
    );
    expect(result).toEqual({
      success: true,
      response: expectedResponse
    });
  });

  it('ChromeTabsService.sendMessageが失敗した場合、エラーを返す', async () => {
    const error = new Error('Tab not found');
    mockChromeTabsService.sendMessage.mockRejectedValue(error);

    // コンソールエラーをモック
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const message = {
      type: 'applyAllRules' as const,
      tabId: tabId
    };

    const result = await handlers.applyAllRules(message);

    expect(result).toEqual({
      success: false,
      error: 'Tab not found'
    });
    expect(consoleSpy).toHaveBeenCalledWith('[background] applyAllRules error:', error);
    
    consoleSpy.mockRestore();
  });

  it('containerのresolveが失敗した場合、エラーを返す', async () => {
    // サービスを一時的に未登録にする（tsyringeでは難しいため、エラーを投げるモックを使用）
    const errorMock = {
      sendMessage: vi.fn().mockRejectedValue(new Error('Service not found'))
    };
    
    container.register(ChromeTabsService, { useValue: errorMock as any });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const message = {
      type: 'applyAllRules' as const,
      tabId: tabId
    };

    const result = await handlers.applyAllRules(message);

    expect(result).toEqual({
      success: false,
      error: 'Service not found'
    });

    consoleSpy.mockRestore();
  });
});
