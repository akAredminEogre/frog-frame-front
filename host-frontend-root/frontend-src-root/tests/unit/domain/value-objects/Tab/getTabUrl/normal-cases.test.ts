import { Tab } from 'src/domain/value-objects/Tab';
import { describe, it, expect } from 'vitest';

/**
 * Tab.getTabUrl メソッドの正常系テスト
 */
describe('Tab.getTabUrl - 正常系', () => {
  it('正しいTabUrlオブジェクトを取得できる', () => {
    const tabId = 1;
    const tabUrl = 'https://example.com';
    const tab = new Tab(tabId, tabUrl);
    
    const result = tab.getTabUrl();
    expect(result.value).toBe(tabUrl);
  });

  it('HTTPのURLでも正しくTabUrlオブジェクトを取得できる', () => {
    const tabId = 123;
    const tabUrl = 'http://localhost:3000/test';
    const tab = new Tab(tabId, tabUrl);
    
    const result = tab.getTabUrl();
    expect(result.value).toBe(tabUrl);
  });
});
