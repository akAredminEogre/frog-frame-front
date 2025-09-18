import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChromeRuntimeService } from 'src/infrastructure/browser/runtime/ChromeRuntimeService';
import { TabId } from 'src/domain/value-objects/TabId';

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
  let tabId: TabId;

  beforeEach(() => {
    chromeRuntimeService = new ChromeRuntimeService();
    tabId = new TabId(1);
    vi.clearAllMocks();
  });

  it('applyAllRulesメッセージを正常に送信する', async () => {
    // chrome.runtime.sendMessageのコールバックを即座に呼び出すようにモック
    mockChrome.runtime.sendMessage.mockImplementation((message, callback) => {
      // コールバックを次のイベントループで呼び出す
      setTimeout(() => callback(), 0);
    });

    const result = await chromeRuntimeService.sendApplyRewriteRuleMessage(tabId);

    expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
      {
        type: 'applyAllRules',
        tabId: tabId.value
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

    const result = await chromeRuntimeService.sendApplyRewriteRuleMessage(tabId);

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

    const result = await chromeRuntimeService.sendApplyRewriteRuleMessage(tabId);

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

    const result = await chromeRuntimeService.sendApplyRewriteRuleMessage(tabId);

    expect(result).toEqual({ success: true });
  });
});
