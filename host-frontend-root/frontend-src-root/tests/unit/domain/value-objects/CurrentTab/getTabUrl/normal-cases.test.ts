import { CurrentTab } from 'src/domain/value-objects/CurrentTab';
import { describe, it, expect } from 'vitest';

/**
 * getTabUrlメソッドの正常系テスト
 */
describe('CurrentTab.getTabUrl - 正常系', () => {
  it('正しいTabUrlオブジェクトを取得できる', () => {
    const tabId = 1;
    const tabUrl = 'https://example.com';
    const currentTab = new CurrentTab(tabId, tabUrl);
    
    const result = currentTab.getTabUrl();
    expect(result.value).toBe(tabUrl);
  });

  it('HTTPのURLでも正しくTabUrlオブジェクトを取得できる', () => {
    const tabId = 123;
    const tabUrl = 'http://localhost:3000/test';
    const currentTab = new CurrentTab(tabId, tabUrl);
    
    const result = currentTab.getTabUrl();
    expect(result.value).toBe(tabUrl);
  });
});
