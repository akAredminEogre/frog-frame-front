import { describe, expect,it } from 'vitest';

import { Tab } from 'src/domain/value-objects/Tab';

/**
 * 1. tabIdプロパティで正しい値を取得できることの確認
 * 2. 複数の値での取得テスト
 */
describe('Tab.tabId - 正常系', () => {
  it('tabIdプロパティで正しい値を取得できる', () => {
    const tab = new Tab(100, 'https://example.com');
    expect(tab.getTabId().value).toBe(100);
  });

  it('インスタンス作成後に値が変わらない', () => {
    const tab = new Tab(42, 'https://test.com');
    const firstAccess = tab.getTabId().value;
    const secondAccess = tab.getTabId().value;
    
    expect(firstAccess).toBe(42);
    expect(secondAccess).toBe(42);
    expect(firstAccess).toBe(secondAccess);
  });

  it('異なるインスタンスは独立した値を持つ', () => {
    const tab1 = new Tab(1, 'https://example1.com');
    const tab2 = new Tab(2, 'https://example2.com');
    
    expect(tab1.getTabId().value).toBe(1);
    expect(tab2.getTabId().value).toBe(2);
    expect(tab1.getTabId().value).not.toBe(tab2.getTabId().value);
  });
});
