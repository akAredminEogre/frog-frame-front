/**
 * RewriteRule.fromPlainObject - 正常系テスト
 * 1. 全パラメータを含むプレーンオブジェクトからのインスタンス生成
 * 2. 必須パラメータのみのプレーンオブジェクトからのインスタンス生成
 * 3. isRegexデフォルト値の確認
 * 4. urlPatternが未定義の場合の処理
 */
import { describe, it, expect } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('RewriteRule.fromPlainObject - 正常系', () => {
  it('should create RewriteRule instance from plain object with all parameters', () => {
    const ruleData = {
      id: 1,
      oldString: 'old text',
      newString: 'new text',
      urlPattern: 'https://example.com/*',
      isRegex: true
    };

    const rule = RewriteRule.fromPlainObject(ruleData);
    
    expect(rule.id).toBe(1);
    expect(rule.oldString).toBe('old text');
    expect(rule.newString).toBe('new text');
    expect(rule.urlPattern).toBe('https://example.com/*');
    expect(rule.isRegex).toBe(true);
  });

  it('should create RewriteRule instance from plain object with required parameters only', () => {
    const ruleData = {
      id: 2,
      oldString: 'search text',
      newString: 'replace text'
    };

    const rule = RewriteRule.fromPlainObject(ruleData);
    
    expect(rule.id).toBe(2);
    expect(rule.oldString).toBe('search text');
    expect(rule.newString).toBe('replace text');
    expect(rule.urlPattern).toBeUndefined();
    expect(rule.isRegex).toBe(false); // デフォルト値
  });

  it('should create RewriteRule instance with isRegex false when explicitly set', () => {
    const ruleData = {
      id: 3,
      oldString: 'pattern',
      newString: 'replacement',
      urlPattern: 'https://test.com/*',
      isRegex: false
    };

    const rule = RewriteRule.fromPlainObject(ruleData);
    
    expect(rule.id).toBe(3);
    expect(rule.oldString).toBe('pattern');
    expect(rule.newString).toBe('replacement');
    expect(rule.urlPattern).toBe('https://test.com/*');
    expect(rule.isRegex).toBe(false);
  });

  it('should create RewriteRule instance with urlPattern undefined when not provided', () => {
    const ruleData = {
      id: 4,
      oldString: 'test',
      newString: 'result',
      isRegex: true
    };

    const rule = RewriteRule.fromPlainObject(ruleData);
    
    expect(rule.id).toBe(4);
    expect(rule.oldString).toBe('test');
    expect(rule.newString).toBe('result');
    expect(rule.urlPattern).toBeUndefined();
    expect(rule.isRegex).toBe(true);
  });

  it('should preserve null values for optional parameters', () => {
    const ruleData = {
      id: 5,
      oldString: 'source',
      newString: 'target',
      urlPattern: null,
      isRegex: null
    };

    const rule = RewriteRule.fromPlainObject(ruleData);
    
    expect(rule.id).toBe(5);
    expect(rule.oldString).toBe('source');
    expect(rule.newString).toBe('target');
    expect(rule.urlPattern).toBe(null);
    expect(rule.isRegex).toBe(null);
  });
});
