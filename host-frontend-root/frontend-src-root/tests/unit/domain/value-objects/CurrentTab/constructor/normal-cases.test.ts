import { CurrentTab } from 'src/domain/value-objects/CurrentTab';
import { describe, it, expect } from 'vitest';

/**
 * 1. 正の整数とURLでの正常なインスタンス作成
 * 2. 大きな正の整数とURLでの正常なインスタンス作成
 */
describe('CurrentTab.constructor - 正常系', () => {
  it('正の整数とURLで正常にインスタンスを作成できる', () => {
    const tabId = 1;
    const tabUrl = 'https://example.com';
    const currentTab = new CurrentTab(tabId, tabUrl);
    expect(currentTab.getTabId().value).toBe(tabId);
    expect(currentTab.getTabUrl().value).toBe(tabUrl);
  });

  it('大きな正の整数とURLで正常にインスタンスを作成できる', () => {
    const tabId = 999999;
    const tabUrl = 'http://localhost:3000/path';
    const currentTab = new CurrentTab(tabId, tabUrl);
    expect(currentTab.getTabId().value).toBe(tabId);
    expect(currentTab.getTabUrl().value).toBe(tabUrl);
  });
});
