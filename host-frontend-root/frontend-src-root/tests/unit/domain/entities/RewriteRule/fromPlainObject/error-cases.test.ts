/**
 * RewriteRule.fromPlainObject - 異常系テスト
 * バリデーションエラー以外の異常系テスト
 * （バリデーションエラーテストは validation-error-cases.test.ts に移動）
 */
import { describe, it, expect } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('RewriteRule.fromPlainObject - 異常系', () => {
  it('should handle partially missing required parameters', () => {
    const ruleDataMissingNewString = {
      id: 1,
      oldString: 'test'
      // newString is missing
    };

    const rule = RewriteRule.fromPlainObject(ruleDataMissingNewString);
    
    expect(rule.id).toBe(1);
    expect(rule.oldString).toBe('test');
    expect(rule.newString).toBeUndefined();
  });
});
