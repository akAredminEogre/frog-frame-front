import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * 1. 空のRewriteRulesに新しいルールを設定できることを確認
 * 2. 既存のRewriteRulesに新しいルールを設定できることを確認（Immutableであることも確認）
 * 3. 同じIDのルールを設定すると上書きされることを確認
 */
describe('RewriteRules.set - 正常系', () => {
  let rule1: RewriteRule;
  let rule2: RewriteRule;
  let rule3: RewriteRule;
  let rulesObject: Record<string, RewriteRule>;

  beforeEach(() => {
    rule1 = new RewriteRule(1, 'old1', 'new1', 'https://example.com/*', false);
    rule2 = new RewriteRule(2, 'old2', 'new2', 'https://test.com/*', true);
    rule3 = new RewriteRule(3, 'old3', 'new3', "", false);
    rulesObject = {
      1: rule1,
      2: rule2,
    };
  });

  it('空のRewriteRulesに新しいルールを設定できる', () => {
    const emptyRules = new RewriteRules();
    const updatedRules = emptyRules.set(rule1);
    
    expect(Object.keys(emptyRules.toObject())).toHaveLength(0); // 元のオブジェクトは変更されない（Immutable）
    expect(Object.keys(updatedRules.toObject())).toHaveLength(1);
    expect(updatedRules.toObject()[1]).toBe(rule1);
  });

  it('既存のRewriteRulesに新しいルールを設定できる', () => {
    const originalRules = new RewriteRules(rulesObject);
    const updatedRules = originalRules.set(rule3);
    
    const originalRulesObject = originalRules.toObject();
    const updatedRulesObject = updatedRules.toObject();
    
    expect(Object.keys(originalRulesObject)).toHaveLength(2); // 元のオブジェクトは変更されない（Immutable）
    expect(Object.keys(updatedRulesObject)).toHaveLength(3);
    expect(updatedRulesObject[1]).toBe(rule1);
    expect(updatedRulesObject[2]).toBe(rule2);
    expect(updatedRulesObject[3]).toBe(rule3);
  });

  it('同じIDのルールを設定すると上書きされる', () => {
    const originalRules = new RewriteRules(rulesObject);
    const newRule1 = new RewriteRule(1, 'updated_old', 'updated_new', 'https://updated.com/*', true);
    const updatedRules = originalRules.set(newRule1);

    const updatedRulesObject = updatedRules.toObject();

    expect(Object.keys(updatedRulesObject)).toHaveLength(2);
    expect(updatedRulesObject[1]).toBe(newRule1);
    expect(updatedRulesObject[1]?.oldString).toBe('updated_old');
  });
});
