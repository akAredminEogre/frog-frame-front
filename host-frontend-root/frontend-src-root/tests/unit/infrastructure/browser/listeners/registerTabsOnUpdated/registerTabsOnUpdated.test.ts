import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerTabsOnUpdated } from 'src/infrastructure/browser/listeners/tabs.onUpdated';

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

describe('registerTabsOnUpdated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    let callback: (tabId: number, changeInfo: any) => void;

    beforeEach(() => {
      mockChrome.tabs.sendMessage.mockResolvedValue({});
      registerTabsOnUpdated();
      // 登録されたコールバック関数を取得
      callback = mockChrome.tabs.onUpdated.addListener.mock.calls[0][0];
    });

    it('タブのロードが完了した場合、applyAllRulesメッセージを送信する', async () => {
      const tabId = 1;
      const changeInfo = { status: 'complete' };

      callback(tabId, changeInfo);

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
        tabId,
        { type: 'applyAllRules' }
      );
    });

    it('statusがcomplete以外の場合、メッセージを送信しない', () => {
      const tabId = 1;
      const changeInfo = { status: 'loading' };

      callback(tabId, changeInfo);

      expect(mockChrome.tabs.sendMessage).not.toHaveBeenCalled();
    });

    it('tabIdが0でもメッセージを送信する', () => {
      const tabId = 0;
      const changeInfo = { status: 'complete' };

      callback(tabId, changeInfo);

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
        tabId,
        { type: 'applyAllRules' }
      );
    });

    it('sendMessageが失敗してもエラーを無視する', async () => {
      const tabId = 1;
      const changeInfo = { status: 'complete' };

      // sendMessageがrejectされるようにモック
      mockChrome.tabs.sendMessage.mockRejectedValue(new Error('Content script not injected'));

      // エラーをスローしないことを確認
      expect(() => {
        callback(tabId, changeInfo);
      }).not.toThrow();

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
        tabId,
        { type: 'applyAllRules' }
      );
    });

    it('異なるtabIdでも正常に動作する', () => {
      const testCases = [
        { tabId: 999 },
        { tabId: 123 }
      ];

      testCases.forEach(({ tabId }) => {
        callback(tabId, { status: 'complete' });
      });

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledTimes(2);
      expect(mockChrome.tabs.sendMessage).toHaveBeenNthCalledWith(
        1,
        999,
        { type: 'applyAllRules' }
      );
      expect(mockChrome.tabs.sendMessage).toHaveBeenNthCalledWith(
        2,
        123,
        { type: 'applyAllRules' }
      );
    });

    it('changeInfoに他のプロパティがあっても、statusのみをチェックする', () => {
      const tabId = 1;
      const changeInfo = { 
        status: 'complete',
        title: 'New Title',
        favIconUrl: 'https://example.com/favicon.ico',
        url: 'https://example.com/new-page'
      };

      callback(tabId, changeInfo);

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
        tabId,
        { type: 'applyAllRules' }
      );
    });
  });
});
