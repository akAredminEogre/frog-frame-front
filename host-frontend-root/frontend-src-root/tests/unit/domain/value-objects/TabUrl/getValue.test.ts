import { TabUrl } from 'src/domain/value-objects/TabUrl';

describe('TabUrl getValue', () => {
  test('正しいURLの値を取得できる', () => {
    const url = 'https://example.com/path';
    const tabUrl = new TabUrl(url);
    expect(tabUrl.getValue()).toBe(url);
  });

  test('HTTPのURLでも正しく値を取得できる', () => {
    const url = 'http://localhost:3000';
    const tabUrl = new TabUrl(url);
    expect(tabUrl.getValue()).toBe(url);
  });
});
