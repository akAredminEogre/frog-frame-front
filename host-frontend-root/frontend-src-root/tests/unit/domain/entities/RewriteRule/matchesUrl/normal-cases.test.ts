/**
 * RewriteRule.matchesUrl - 正常系テスト
 * 1. URLパターンが空文字列の場合はfalseを返す
 * 2. URLが前方一致する場合はtrueを返す
 * 3. URLが前方一致しない場合はfalseを返す
 */
import { describe, it, expect } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('RewriteRule.matchesUrl - 正常系', () => {
  it('should return false when urlPattern is empty string', () => {
    const rule = new RewriteRule('1', 'old', 'new', '');
    
    expect(rule.matchesUrl('https://example.com/page')).toBe(false);
  });

  it('should return true when URL starts with urlPattern', () => {
    const rule = new RewriteRule('1', 'old', 'new', 'https://example.com');
    
    expect(rule.matchesUrl('https://example.com/page')).toBe(true);
    expect(rule.matchesUrl('https://example.com')).toBe(true);
  });

  it('should return false when URL does not start with urlPattern', () => {
    const rule = new RewriteRule('1', 'old', 'new', 'https://example.com');
    
    expect(rule.matchesUrl('https://other.com/page')).toBe(false);
    expect(rule.matchesUrl('http://example.com/page')).toBe(false);
  });

  it('should perform exact prefix matching', () => {
    const rule = new RewriteRule('1', 'old', 'new', 'https://example.com/api');
    
    expect(rule.matchesUrl('https://example.com/api/users')).toBe(true);
    expect(rule.matchesUrl('https://example.com/api')).toBe(true);
    expect(rule.matchesUrl('https://example.com/app')).toBe(false);
  });
});
