import { TabUrl } from 'src/domain/value-objects/TabUrl';

/**
 * TabUrl constructor - 正常系テスト
 * 1. 正常なHTTPSのURLで作成し、値が正しく保存されることを確認
 * 2. 正常なHTTPのURLで作成し、値が正しく保存されることを確認
 */
describe('TabUrl constructor - 正常系', () => {
  test('正常なHTTPSのURLで作成できる', () => {
    const url = 'https://example.com';
    const tabUrl = new TabUrl(url);
    expect(tabUrl.getValue()).toBe(url);
  });

  test('正常なHTTPのURLで作成できる', () => {
    const url = 'http://example.com';
    const tabUrl = new TabUrl(url);
    expect(tabUrl.getValue()).toBe(url);
  });
});
