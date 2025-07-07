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
      set: vi.fn(),
    },
  },
  action: {
    ...fakeBrowser.action,
    openPopup: vi.fn(),
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

    // THEN: chrome.storage.local.set が正しい引数で呼び出される
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { tempSelectedText: 'テスト用の選択テキスト' },
      expect.any(Function) // 第2引数はコールバック関数
    );

    // AND: chrome.action.openPopup が呼び出される
    // storage.local.setのコールバック内で呼ばれるため、コールバックを直接実行する
    const callback = vi.mocked(chrome.storage.local.set).mock.calls[0][1];
    if (callback) {
      callback();
    }
    expect(chrome.action.openPopup).toHaveBeenCalled();
  });
});
