import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * 1. 空のRewriteRulesに新しいルールを追加できることを確認
 * 2. 既存のRewriteRulesに新しいルールを追加できることを確認（Immutableであることも確認）
 * 3. 同じIDのルールを追加すると上書きされることを確認
 */
describe('RewriteRules.add - 正常系', () => {
  let rule1: RewriteRule;
  let rule2: RewriteRule;
  let rule3: RewriteRule;
  let rulesObject: Record<string, RewriteRule>;

  beforeEach(() => {
    rule1 = new RewriteRule('rule1', 'old1', 'new1', 'https://example.com/*', false);
    rule2 = new RewriteRule('rule2', 'old2', 'new2', 'https://test.com/*', true);
    rule3 = new RewriteRule('rule3', 'old3', 'new3', "", false);
    rulesObject = {
      rule1,
      rule2,
    };
  });

  it('空のRewriteRulesに新しいルールを追加できる', () => {
    const emptyRules = new RewriteRules();
    const updatedRules = emptyRules.add(rule1);
    
    expect(Object.keys(emptyRules.toObject())).toHaveLength(0); // 元のオブジェクトは変更されない（Immutable）
    expect(Object.keys(updatedRules.toObject())).toHaveLength(1);
    expect(updatedRules.toObject()['rule1']).toBe(rule1);
  });

  it('既存のRewriteRulesに新しいルールを追加できる', () => {
    const originalRules = new RewriteRules(rulesObject);
    const updatedRules = originalRules.add(rule3);
    
    const originalRulesObject = originalRules.toObject();
    const updatedRulesObject = updatedRules.toObject();
    
    expect(Object.keys(originalRulesObject)).toHaveLength(2); // 元のオブジェクトは変更されない（Immutable）
    expect(Object.keys(updatedRulesObject)).toHaveLength(3);
    expect(updatedRulesObject['rule1']).toBe(rule1);
    expect(updatedRulesObject['rule2']).toBe(rule2);
    expect(updatedRulesObject['rule3']).toBe(rule3);
  });

  it('同じIDのルールを追加すると上書きされる', () => {
    const originalRules = new RewriteRules(rulesObject);
    const newRule1 = new RewriteRule('rule1', 'updated_old', 'updated_new', 'https://updated.com/*', true);
    const updatedRules = originalRules.add(newRule1);
    
    const updatedRulesObject = updatedRules.toObject();
    
    expect(Object.keys(updatedRulesObject)).toHaveLength(2);
    expect(updatedRulesObject['rule1']).toBe(newRule1);
    expect(updatedRulesObject['rule1']?.oldString).toBe('updated_old');
  });
});
