import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Tab } from 'src/domain/value-objects/Tab';
import { ChromeRuntimeService } from 'src/infrastructure/browser/runtime/ChromeRuntimeService';

// Chrome APIのモック
const mockChrome = {
  runtime: {
    sendMessage: vi.fn()
  }
};

// グローバルのchromeオブジェクトをモック
global.chrome = mockChrome as any;

describe('ChromeRuntimeService.sendApplyRewriteRuleMessage', () => {
  let chromeRuntimeService: ChromeRuntimeService;
  let currentTab: Tab;

  beforeEach(() => {
    chromeRuntimeService = new ChromeRuntimeService();
    currentTab = new Tab(1, 'https://example.com');
    vi.clearAllMocks();
  });

  it('applyAllRulesメッセージを正常に送信する', async () => {
    // chrome.runtime.sendMessageのコールバックを即座に呼び出すようにモック
    mockChrome.runtime.sendMessage.mockImplementation((message, callback) => {
      // コールバックを次のイベントループで呼び出す
      setTimeout(() => callback(), 0);
    });

    const result = await chromeRuntimeService.sendApplyRewriteRuleMessage(currentTab);

    expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
      {
        type: 'applyAllRules',
        tabId: currentTab.getTabId().value,
        tabUrl: currentTab.getTabUrl().value
      },
      expect.any(Function)
    );
    expect(result).toEqual({ success: true });
  });

  it('メッセージ送信時に例外が発生した場合、エラーを返す', async () => {
    const error = new Error('Runtime error');
    
    // 異常系: chrome.runtime.sendMessageモックが例外をスローする
    mockChrome.runtime.sendMessage.mockImplementation(() => {
      throw error;
    });

    const result = await chromeRuntimeService.sendApplyRewriteRuleMessage(currentTab);

    expect(result).toEqual({ 
      success: false, 
      error: 'Runtime error' 
    });
  });

  it('文字列エラーの場合も適切にハンドリングする', async () => {
    const errorMessage = 'String error message';
    
    // 異常系: chrome.runtime.sendMessageモックが文字列例外をスローする（Errorオブジェクト以外）
    mockChrome.runtime.sendMessage.mockImplementation(() => {
      throw errorMessage;
    });

    const result = await chromeRuntimeService.sendApplyRewriteRuleMessage(currentTab);

    expect(result).toEqual({ 
      success: false, 
      error: 'String error message' 
    });
  });


  it('コールバックが呼ばれてもエラーを無視して成功を返す', async () => {
    // コールバック内でchrome.runtime.lastErrorがあってもエラーを無視する設計のテスト
    mockChrome.runtime.sendMessage.mockImplementation((message, callback) => {
      // chrome.runtime.lastErrorをシミュレート
      (global as any).chrome.runtime.lastError = { message: 'Some extension error' };
      setTimeout(() => {
        callback();
        // テスト後にクリーンアップ
        delete (global as any).chrome.runtime.lastError;
      }, 0);
    });

    const result = await chromeRuntimeService.sendApplyRewriteRuleMessage(currentTab);

    expect(result).toEqual({ success: true });
  });
});
