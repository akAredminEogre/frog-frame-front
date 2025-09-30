import { TabUrl } from 'src/domain/value-objects/TabUrl';
import { describe, it, expect } from 'vitest';

/**
 * 1. valueプロパティで正しい値を取得できることの確認
 * 2. valueプロパティが読み取り専用であることの確認
 */
describe('TabUrl.value - 正常系', () => {
  it('valueプロパティで正しい値を取得できる', () => {
    const testValues = [
      'https://example.com',
      'http://localhost:3000',
      'https://example.com/path',
      'http://localhost:8080/api/test',
      'https://subdomain.example.com/path?query=value'
    ];
    
    testValues.forEach(value => {
      const tabUrl = new TabUrl(value);
      expect(tabUrl.value).toBe(value);
    });
  });

  it('valueプロパティは読み取り専用である', () => {
    const tabUrl = new TabUrl('https://example.com');
    expect(() => {
      (tabUrl as any).value = 'https://other.com';
    }).toThrow();
  });
});
