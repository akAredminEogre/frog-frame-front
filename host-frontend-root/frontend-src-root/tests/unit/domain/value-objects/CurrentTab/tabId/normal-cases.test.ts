import { CurrentTab } from 'src/domain/value-objects/CurrentTab';
import { describe, it, expect } from 'vitest';

/**
 * 1. tabIdプロパティで正しい値を取得できることの確認
 * 2. 複数の値での取得テスト
 */
describe('CurrentTab.tabId - 正常系', () => {
  it('tabIdプロパティで正しい値を取得できる', () => {
    const currentTab = new CurrentTab(100, 'https://example.com');
    expect(currentTab.getTabId().value).toBe(100);
  });

  it('インスタンス作成後に値が変わらない', () => {
    const currentTab = new CurrentTab(42, 'https://test.com');
    const firstAccess = currentTab.getTabId().value;
    const secondAccess = currentTab.getTabId().value;
    
    expect(firstAccess).toBe(42);
    expect(secondAccess).toBe(42);
    expect(firstAccess).toBe(secondAccess);
  });

  it('異なるインスタンスは独立した値を持つ', () => {
    const currentTab1 = new CurrentTab(1, 'https://example1.com');
    const currentTab2 = new CurrentTab(2, 'https://example2.com');
    
    expect(currentTab1.getTabId().value).toBe(1);
    expect(currentTab2.getTabId().value).toBe(2);
    expect(currentTab1.getTabId().value).not.toBe(currentTab2.getTabId().value);
  });
});
