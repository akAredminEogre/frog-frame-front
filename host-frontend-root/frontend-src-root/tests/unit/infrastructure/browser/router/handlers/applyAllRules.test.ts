import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handlers } from 'src/infrastructure/browser/router/messageHandlers';
import { SimpleContainer } from 'src/infrastructure/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

// Chrome APIのモック
const mockChromeTabsService = {
  sendMessage: vi.fn()
};

describe('handlers.applyAllRules', () => {
  let container: SimpleContainer;
  let messageHandlers: ReturnType<typeof handlers>;
  let currentTab: CurrentTab;

  beforeEach(() => {
    container = new SimpleContainer();
    
    // ChromeTabsServiceをモックでコンテナに登録
    container.register(ChromeTabsService, () => mockChromeTabsService as any);
    
    messageHandlers = handlers(container);
    currentTab = new CurrentTab(1);
    
    vi.clearAllMocks();
  });

  it('正常にapplyAllRulesメッセージを処理する', async () => {
    const expectedResponse = { success: true, data: 'applied' };
    mockChromeTabsService.sendMessage.mockResolvedValue(expectedResponse);

    const message = {
      type: 'applyAllRules' as const,
      currentTab
    };

    const result = await messageHandlers.applyAllRules(message);

    expect(mockChromeTabsService.sendMessage).toHaveBeenCalledWith(
      currentTab,
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
      currentTab
    };

    const result = await messageHandlers.applyAllRules(message);

    expect(result).toEqual({
      success: false,
      error: 'Tab not found'
    });
    expect(consoleSpy).toHaveBeenCalledWith('[background] applyAllRules error:', error);
    
    consoleSpy.mockRestore();
  });

  it('containerのresolveが失敗した場合、エラーを返す', async () => {
    // 新しいコンテナでChromeTabsServiceを未登録にする
    const emptyContainer = new SimpleContainer();
    const emptyHandlers = handlers(emptyContainer);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const message = {
      type: 'applyAllRules' as const,
      currentTab
    };

    const result = await emptyHandlers.applyAllRules(message);

    expect(result).toEqual({
      success: false,
      error: 'Service ChromeTabsService not found'
    });

    consoleSpy.mockRestore();
  });
});
