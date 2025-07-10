import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fakeBrowser } from 'wxt/testing';
import background from '../background';

// fakeBrowserを拡張して、未実装のAPIをモックする
const browserWithMocks = {
    ...fakeBrowser,
    contextMenus: {
      ...fakeBrowser.contextMenus,
      onClicked: {
        ...fakeBrowser.contextMenus?.onClicked,
        addListener: vi.fn(),
      },
    },
    storage: {
      ...fakeBrowser.storage,
      local: {
        ...fakeBrowser.storage.local,
        set: vi.fn((items, callback) => {
          // storage.local.setが呼び出されたら、そのコールバックをすぐに実行する
          if (callback) {
            callback();
          }
        }),
      },
    },
    action: {
      ...fakeBrowser.action,
      openPopup: vi.fn(),
    },
    tabs: {
      ...fakeBrowser.tabs,
      sendMessage: vi.fn((tabId, message, callback) => {
        if (message.type === 'getSelection') {
          // getSelectionメッセージに対する応答をシミュレート
          const response = { selection: 'テスト用の選択HTML' };
          if (callback) {
            callback(response);
          }
        }
        return Promise.resolve();
      }),
    },
    runtime: {
      ...fakeBrowser.runtime,
      lastError: null, // エラーが発生しないことを示す
    },
  };

// グローバルなchromeオブジェクトをモック
vi.stubGlobal('chrome', browserWithMocks);

describe('Background Script', () => {
  beforeEach(() => {
    // 各テストの前にモックの状態をリセット
    vi.clearAllMocks();
    // backgroundスクリプトのmain関数を実行
    background.main();
  });

  test('コンテキストメニュークリックで選択テキストがストレージに保存される', async () => {
    // GIVEN: テスト用のクリック情報
    const info: chrome.contextMenus.OnClickData = {
      menuItemId: 'replace-text', // `このテキストを置換` メニューのID
      selectionText: 'テスト用の選択テキスト',
      editable: false,
      pageUrl: 'https://example.com',
    };
    const tab: chrome.tabs.Tab = {
      id: 1,
      index: 0,
      highlighted: true,
      active: true,
      pinned: false,
      incognito: false,
      windowId: 1,
      autoDiscardable: true,
      // 不足していたプロパティを追加
      selected: true,
      discarded: false,
      groupId: -1,
      frozen: false,
    };

    // WHEN: contextMenus.onClicked イベントリスナーを呼び出す
    const onClickedCallback = vi.mocked(chrome.contextMenus.onClicked.addListener).mock.calls[0][0];
    await onClickedCallback(info, tab);

    // THEN: chrome.tabs.sendMessage が正しい引数で呼び出される
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
      tab.id,
      { type: 'getSelection' },
      expect.any(Function)
    );

    // AND: chrome.storage.local.set が正しい引数で呼び出される
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { tempSelectedText: 'テスト用の選択HTML' }, // sendMessageのモックで設定した応答
      expect.any(Function) // 第2引数はコールバック関数
    );

    // AND: chrome.action.openPopup が呼び出される
    // storage.local.setのモック内でコールバックが実行されるため、ここでは直接expectする
    expect(chrome.action.openPopup).toHaveBeenCalled();
  });
});
