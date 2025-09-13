import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

// Chrome APIのモック
const mockChrome = {
  tabs: {
    sendMessage: vi.fn()
  }
};

// グローバルのchromeオブジェクトをモック
global.chrome = mockChrome as any;

describe('ChromeTabsService.sendMessage', () => {
  let chromeTabsService: ChromeTabsService;
  let currentTab: CurrentTab;

  beforeEach(() => {
    chromeTabsService = new ChromeTabsService();
    currentTab = new CurrentTab(1);
    vi.clearAllMocks();
  });

  it('正常にメッセージを送信し、レスポンスを返す', async () => {
    const expectedResponse = { success: true, data: 'test response' };
    mockChrome.tabs.sendMessage.mockResolvedValue(expectedResponse);

    const message = { type: 'testMessage', payload: 'test' };
    const result = await chromeTabsService.sendMessage(currentTab, message);

    expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(1, message);
    expect(result).toEqual(expectedResponse);
  });

  it('異なるCurrentTabでも正常に動作する', async () => {
    const differentTab = new CurrentTab(999);
    const expectedResponse = { success: true };
    mockChrome.tabs.sendMessage.mockResolvedValue(expectedResponse);

    const message = { type: 'anotherMessage' };
    const result = await chromeTabsService.sendMessage(differentTab, message);

    expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(999, message);
    expect(result).toEqual(expectedResponse);
  });

  it('chrome.tabs.sendMessageが失敗した場合、エラーを再スローする', async () => {
    const error = new Error('Tab not found');
    mockChrome.tabs.sendMessage.mockRejectedValue(error);

    // コンソールエラーをモック
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const message = { type: 'failMessage' };

    await expect(chromeTabsService.sendMessage(currentTab, message)).rejects.toThrow('Tab not found');
    
    expect(consoleSpy).toHaveBeenCalledWith('[ChromeTabsService] sendMessage error:', error);
    
    consoleSpy.mockRestore();
  });

  it('様々な形式のメッセージを送信できる', async () => {
    const testCases = [
      { type: 'simple', value: 'text' },
      { type: 'complex', nested: { data: [1, 2, 3] } },
      { type: 'array', items: ['a', 'b', 'c'] },
      null,
      'stringMessage'
    ];

    mockChrome.tabs.sendMessage.mockResolvedValue({ success: true });

    for (const message of testCases) {
      await chromeTabsService.sendMessage(currentTab, message);
      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(1, message);
    }

    expect(mockChrome.tabs.sendMessage).toHaveBeenCalledTimes(testCases.length);
  });

  it('非同期処理が正しく動作する', async () => {
    const delayedResponse = { delayed: true };
    mockChrome.tabs.sendMessage.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(delayedResponse), 50))
    );

    const message = { type: 'delayed' };
    const result = await chromeTabsService.sendMessage(currentTab, message);

    expect(result).toEqual(delayedResponse);
    expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(1, message);
  });
});
