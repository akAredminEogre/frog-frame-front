import { describe, expect,it } from 'vitest';

import { Tab } from 'src/domain/value-objects/Tab';

/**
 * 1. 正の整数とURLでの正常なインスタンス作成
 * 2. 大きな正の整数とURLでの正常なインスタンス作成
 */
describe('Tab.constructor - 正常系', () => {
  it('正の整数とURLで正常にインスタンスを作成できる', () => {
    const tabId = 1;
    const tabUrl = 'https://example.com';
    const tab = new Tab(tabId, tabUrl);
    expect(tab.getTabId().value).toBe(tabId);
    expect(tab.getTabUrl().value).toBe(tabUrl);
  });

  it('大きな正の整数とURLで正常にインスタンスを作成できる', () => {
    const tabId = 999999;
    const tabUrl = 'http://localhost:3000/path';
    const tab = new Tab(tabId, tabUrl);
    expect(tab.getTabId().value).toBe(tabId);
    expect(tab.getTabUrl().value).toBe(tabUrl);
  });
});
