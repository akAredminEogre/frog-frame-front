import 'tests/unit/infrastructure/persistence/indexeddb/setup';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { InvalidRuleIdError } from 'src/enterprise-business-rules/errors/InvalidRuleIdError';
import { UNASSIGNED_RULE_ID } from 'src/enterprise-business-rules/value-objects/ids/RuleId';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';

const baseParams = {
  oldString: 'pattern',
  newString: 'replacement',
  urlPattern: '',
  isRegex: false,
};

/**
 * DexieRewriteRuleRepository.replaceAll - 異常系（トランザクションロールバック）
 *
 * replaceAll は Dexie トランザクション内で clear() → bulkAdd() を実行する。
 * bulkAdd が失敗した場合、トランザクションが自動ロールバックされ、
 * clear() も巻き戻るため「置換前のレコードが残存する」ことを検証する。
 *
 * 1. bulkAdd 失敗（重複主キー）時に replaceAll は reject する
 * 2. bulkAdd 失敗後も置換前のレコードが残存する（clear() がロールバックされる）
 */
describe('DexieRewriteRuleRepository.replaceAll - 異常系（ロールバック）', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
    // 置換前の既存レコードを用意
    await repository.replaceAll([
      RewriteRule.fromParams(1, { ...baseParams, oldString: 'original-1' }),
      RewriteRule.fromParams(2, { ...baseParams, oldString: 'original-2' }),
    ]);
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('bulkAdd 失敗（重複主キー）時に replaceAll は reject する', async () => {
    // 同一の採番済IDを2件含める → bulkAdd が ConstraintError で失敗する
    const duplicateIdRules = [
      RewriteRule.fromParams(5, { ...baseParams, oldString: 'dup-a' }),
      RewriteRule.fromParams(5, { ...baseParams, oldString: 'dup-b' }),
    ];

    await expect(repository.replaceAll(duplicateIdRules)).rejects.toThrow();
  });

  it('bulkAdd 失敗後も置換前のレコードが残存する（clear() がロールバックされる）', async () => {
    const duplicateIdRules = [
      RewriteRule.fromParams(5, { ...baseParams, oldString: 'dup-a' }),
      RewriteRule.fromParams(5, { ...baseParams, oldString: 'dup-b' }),
    ];

    await expect(repository.replaceAll(duplicateIdRules)).rejects.toThrow();

    // clear() がロールバックされ、置換前の2件がそのまま残る
    const stored = (await repository.getAll()).toArray();
    expect(stored).toHaveLength(2);
    const oldStrings = stored.map((r) => r.oldString).sort();
    expect(oldStrings).toEqual(['original-1', 'original-2']);
    // 失敗した置換内容（dup-*）は1件も混入していない
    expect(stored.some((r) => r.oldString.startsWith('dup-'))).toBe(false);
  });

  /**
   * 回帰（PR#405 Copilot 指摘）:
   * 採番済IDが安全整数上限(Number.MAX_SAFE_INTEGER)付近で、かつ未採番ルールが混在する場合、
   * 未採番ルールに割り当てる maxAssignedId+1 が安全整数範囲外(2^53)になる。
   * この場合 createRuleId() が InvalidRuleIdError を投げ、replaceAll は reject し、
   * 不正なIDのレコードは永続化されず置換前の状態が保たれることを検証する。
   */
  it('採番済ID=MAX_SAFE_INTEGER + 未採番ルール混在は InvalidRuleIdError で reject しロールバックする', async () => {
    const overflowRules = [
      RewriteRule.fromParams(Number.MAX_SAFE_INTEGER, { ...baseParams, oldString: 'max-safe' }),
      RewriteRule.fromParams(UNASSIGNED_RULE_ID, { ...baseParams, oldString: 'unassigned' }),
    ];

    await expect(repository.replaceAll(overflowRules)).rejects.toThrow(InvalidRuleIdError);

    // 置換前の2件がそのまま残り、overflow 内容は1件も混入していない
    const stored = (await repository.getAll()).toArray();
    expect(stored).toHaveLength(2);
    const oldStrings = stored.map((r) => r.oldString).sort();
    expect(oldStrings).toEqual(['original-1', 'original-2']);
    expect(stored.some((r) => r.oldString === 'max-safe' || r.oldString === 'unassigned')).toBe(false);
  });
});
