import { TabId } from 'src/domain/value-objects/TabId';
import { describe, it, expect } from 'vitest';

/**
 * 1. valueプロパティで正しい値を取得できることの確認
 * 2. valueプロパティが読み取り専用であることの確認
 */
describe('TabId.value - 正常系', () => {
  it('valueプロパティで正しい値を取得できる', () => {
    const testValues = [1, 2, 10, 100, 999999];
    
    testValues.forEach(value => {
      const tabId = new TabId(value);
      expect(tabId.value).toBe(value);
    });
  });

  it('valueプロパティは読み取り専用である', () => {
    const tabId = new TabId(1);
    expect(() => {
      (tabId as any).value = 2;
    }).toThrow();
  });
});
