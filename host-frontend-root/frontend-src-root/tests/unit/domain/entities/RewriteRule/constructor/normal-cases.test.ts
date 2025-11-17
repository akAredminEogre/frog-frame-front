/**
 * RewriteRule.constructor - 正常系テスト
 * 1. 必須パラメータでのインスタンス生成（urlPatternが空文字列）
 * 2. 全パラメータでのインスタンス生成  
 * 3. isRegexデフォルト値の確認
 * 4. isActiveデフォルト値の確認
 */
import { describe, expect,it } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('RewriteRule.constructor - 正常系', () => {
  it('should create RewriteRule instance with required parameters', () => {
    const rule = new RewriteRule(1, 'old', 'new', '');

    expect(rule.id).toBe(1);
    expect(rule.oldString).toBe('old');
    expect(rule.newString).toBe('new');
    expect(rule.urlPattern).toBe('');
    expect(rule.isRegex).toBe(false);
    expect(rule.isActive).toBe(true);
  });

  it('should create RewriteRule instance with all parameters', () => {
    const rule = new RewriteRule(1, 'old', 'new', 'https://example.com', true);

    expect(rule.id).toBe(1);
    expect(rule.oldString).toBe('old');
    expect(rule.newString).toBe('new');
    expect(rule.urlPattern).toBe('https://example.com');
    expect(rule.isRegex).toBe(true);
    expect(rule.isActive).toBe(true);
  });

  it('should set isRegex to false by default', () => {
    const rule = new RewriteRule(1, 'old', 'new', 'https://example.com');
    
    expect(rule.isRegex).toBe(false);
  });

  it('should set isActive to true by default', () => {
    const rule = new RewriteRule(1, 'old', 'new', 'https://example.com');
    
    expect(rule.isActive).toBe(true);
  });

  it('should set isActive to false when explicitly specified', () => {
    const rule = new RewriteRule(1, 'old', 'new', 'https://example.com', false, false);
    
    expect(rule.isActive).toBe(false);
  });
});
