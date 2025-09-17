import { CurrentTab } from 'src/domain/value-objects/CurrentTab';
import { describe, it, expect } from 'vitest';

/**
 * 1. tabIdプロパティで正しい値を取得できることの確認
 * 2. 複数の値での取得テスト
 */
describe('CurrentTab.tabId - 正常系', () => {
  it('tabIdプロパティで正しい値を取得できる', () => {
    const currentTab = new CurrentTab(100);
    expect(currentTab.tabId).toBe(100);
  });

  it('インスタンス作成後に値が変わらない', () => {
    const currentTab = new CurrentTab(42);
    const firstAccess = currentTab.tabId;
    const secondAccess = currentTab.tabId;
    
    expect(firstAccess).toBe(42);
    expect(secondAccess).toBe(42);
    expect(firstAccess).toBe(secondAccess);
  });

  it('異なるインスタンスは独立した値を持つ', () => {
    const currentTab1 = new CurrentTab(1);
    const currentTab2 = new CurrentTab(2);
    
    expect(currentTab1.tabId).toBe(1);
    expect(currentTab2.tabId).toBe(2);
    expect(currentTab1.tabId).not.toBe(currentTab2.tabId);
  });
});
