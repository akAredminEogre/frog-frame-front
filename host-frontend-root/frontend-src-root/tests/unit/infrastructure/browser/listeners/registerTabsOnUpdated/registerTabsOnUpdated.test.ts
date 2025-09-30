import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerTabsOnUpdated } from 'src/infrastructure/browser/listeners/tabs.onUpdated';
import { container } from 'src/infrastructure/di/container';

// Chrome APIのモック
const mockChrome = {
  tabs: {
    onUpdated: {
      addListener: vi.fn()
    },
    sendMessage: vi.fn()
  }
};

// グローバルのchromeオブジェクトをモック
global.chrome = mockChrome as any;

// DIコンテナとサービスのモック
const mockCurrentTab = {
  getTabUrl: vi.fn().mockReturnValue({
    value: 'https://example.com'
  })
};

const mockCurrentTabService = {
  getTabById: vi.fn().mockResolvedValue(mockCurrentTab)
};

vi.mock('src/infrastructure/di/container', () => ({
  container: {
    resolve: vi.fn()
  }
}));

describe('registerTabsOnUpdated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // DIコンテナのモックを設定
    const mockContainer = container as any;
    mockContainer.resolve.mockReturnValue(mockCurrentTabService);
  });

  it('chrome.tabs.onUpdated.addListenerにコールバックを登録する', () => {
    registerTabsOnUpdated();

    expect(mockChrome.tabs.onUpdated.addListener).toHaveBeenCalledTimes(1);
    expect(mockChrome.tabs.onUpdated.addListener).toHaveBeenCalledWith(expect.any(Function));
  });

  it('複数回呼び出すと複数のリスナーが登録される', () => {
    registerTabsOnUpdated();
    registerTabsOnUpdated();

    expect(mockChrome.tabs.onUpdated.addListener).toHaveBeenCalledTimes(2);
  });

  describe('onUpdated listener callback', () => {
    let callback: (tabId: number, changeInfo: any) => Promise<void>;

    beforeEach(() => {
      mockChrome.tabs.sendMessage.mockResolvedValue({});
      registerTabsOnUpdated();
      // 登録されたコールバック関数を取得
      callback = mockChrome.tabs.onUpdated.addListener.mock.calls[0][0];
    });

    it('タブのロードが完了した場合、applyAllRulesメッセージを送信する', async () => {
      const tabId = 1;
      const changeInfo = { status: 'complete' };

      await callback(tabId, changeInfo);

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
        tabId,
        { type: 'applyAllRules', tabUrl: 'https://example.com' }
      );
    });

    it('statusがcomplete以外の場合、メッセージを送信しない', async () => {
      const tabId = 1;
      const changeInfo = { status: 'loading' };

      await callback(tabId, changeInfo);

      expect(mockChrome.tabs.sendMessage).not.toHaveBeenCalled();
    });

    it('小さな正の整数のtabIdでもメッセージを送信する', async () => {
      const tabId = 1;
      const changeInfo = { status: 'complete' };

      await callback(tabId, changeInfo);

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
        tabId,
        { type: 'applyAllRules', tabUrl: 'https://example.com' }
      );
    });

    it('sendMessageが失敗してもエラーを無視する', async () => {
      const tabId = 1;
      const changeInfo = { status: 'complete' };

      // sendMessageがrejectされるようにモック
      mockChrome.tabs.sendMessage.mockRejectedValue(new Error('Content script not injected'));

      // エラーをスローしないことを確認
      await expect(callback(tabId, changeInfo)).resolves.not.toThrow();

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
        tabId,
        { type: 'applyAllRules', tabUrl: 'https://example.com' }
      );
    });

    it('異なるtabIdでも正常に動作する', async () => {
      const testCases = [
        { tabId: 999 },
        { tabId: 123 }
      ];

      for (const { tabId } of testCases) {
        await callback(tabId, { status: 'complete' });
      }

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledTimes(2);
      expect(mockChrome.tabs.sendMessage).toHaveBeenNthCalledWith(
        1,
        999,
        { type: 'applyAllRules', tabUrl: 'https://example.com' }
      );
      expect(mockChrome.tabs.sendMessage).toHaveBeenNthCalledWith(
        2,
        123,
        { type: 'applyAllRules', tabUrl: 'https://example.com' }
      );
    });

    it('changeInfoに他のプロパティがあっても、statusのみをチェックする', async () => {
      const tabId = 1;
      const changeInfo = { 
        status: 'complete',
        title: 'New Title',
        favIconUrl: 'https://example.com/favicon.ico',
        url: 'https://example.com/new-page'
      };

      await callback(tabId, changeInfo);

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
        tabId,
        { type: 'applyAllRules', tabUrl: 'https://example.com' }
      );
    });
  });
});
