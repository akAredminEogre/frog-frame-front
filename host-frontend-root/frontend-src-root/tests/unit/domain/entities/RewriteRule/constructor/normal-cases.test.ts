/**
 * RewriteRule.constructor - 正常系テスト
 * 1. 必須パラメータのみでのインスタンス生成
 * 2. 全パラメータでのインスタンス生成  
 * 3. isRegexデフォルト値の確認
 */
import { describe, it, expect } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('RewriteRule.constructor - 正常系', () => {
  it('should create RewriteRule instance with required parameters', () => {
    const rule = new RewriteRule('1', 'old', 'new');
    
    expect(rule.id).toBe('1');
    expect(rule.oldString).toBe('old');
    expect(rule.newString).toBe('new');
    expect(rule.urlPattern).toBeUndefined();
    expect(rule.isRegex).toBe(false);
  });

  it('should create RewriteRule instance with all parameters', () => {
    const rule = new RewriteRule('1', 'old', 'new', 'https://example.com', true);
    
    expect(rule.id).toBe('1');
    expect(rule.oldString).toBe('old');
    expect(rule.newString).toBe('new');
    expect(rule.urlPattern).toBe('https://example.com');
    expect(rule.isRegex).toBe(true);
  });

  it('should set isRegex to false by default', () => {
    const rule = new RewriteRule('1', 'old', 'new', 'https://example.com');
    
    expect(rule.isRegex).toBe(false);
  });
});
