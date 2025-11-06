import { TabUrl } from 'src/domain/value-objects/TabUrl';

/**
 * TabUrl constructor - 正常系テスト
 * 1. 正常なHTTPSのURLで作成し、値が正しく保存され、tabOriginが設定されることを確認
 * 2. 正常なHTTPのURLで作成し、値が正しく保存され、tabOriginが設定されることを確認
 * 3. Chrome関連プロトコルのURLで作成し、値が正しく保存され、tabOriginが空文字になることを確認
 * 4. Chrome拡張機能のURLで作成し、値が正しく保存され、tabOriginが空文字になることを確認
 */
describe('TabUrl constructor - 正常系', () => {
  test('正常なHTTPSのURLで作成できる', () => {
    const url = 'https://example.com';
    const tabUrl = new TabUrl(url);
    expect(tabUrl.value).toBe(url);
    expect(tabUrl.tabOrigin).toBe('https://example.com');
  });

  test('正常なHTTPのURLで作成できる', () => {
    const url = 'http://example.com';
    const tabUrl = new TabUrl(url);
    expect(tabUrl.value).toBe(url);
    expect(tabUrl.tabOrigin).toBe('http://example.com');
  });

  test('Chrome関連プロトコルのURLで作成できる', () => {
    const url = 'chrome://extensions/';
    const tabUrl = new TabUrl(url);
    expect(tabUrl.value).toBe(url);
    expect(tabUrl.tabOrigin).toBe('');
  });

  test('Chrome拡張機能のURLで作成できる', () => {
    const url = 'chrome-extension://abcdefgh/popup.html';
    const tabUrl = new TabUrl(url);
    expect(tabUrl.value).toBe(url);
    expect(tabUrl.tabOrigin).toBe('');
  });
});
