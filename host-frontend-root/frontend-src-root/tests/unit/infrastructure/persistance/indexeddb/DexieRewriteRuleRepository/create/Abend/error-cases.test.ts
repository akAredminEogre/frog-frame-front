import '../../../setup';

import { afterEach,beforeEach, describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { dexieDatabase } from 'src/infrastructure/persistance/indexeddb/DexieDatabase';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository';

/**
 * 1. 既存のIDを持つレコードを追加しようとした場合、エラーが発生する
 *
 * 注意: 現在のcreate実装はIDを自動採番するため、この状況は通常発生しません。
 * このテストは、データベースの制約が正しく機能することを確認し、
 * 将来の実装変更に備えるものです。
 */
describe('DexieRewriteRuleRepository.create - 異常系', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    // データベーステーブルをクリア
    await dexieDatabase.rewriteRules.clear();

    repository = new DexieRewriteRuleRepository();
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('should throw error when trying to add record with existing ID', async () => {
    // Arrange
    const firstRule = new RewriteRule(
      1,
      'pattern1',
      'replacement1',
      ''
    );

    // 最初のルールを作成してIDを取得
    await repository.create(firstRule);
    const allRules = await repository.getAll();
    const createdRule = allRules.toArray()[0];
    const existingId = Number(createdRule.id);

    // Act & Assert - 既存のIDで直接追加しようとするとエラーが発生
    await expect(
      dexieDatabase.rewriteRules.add({
        id: existingId,
        oldString: 'pattern2',
        newString: 'replacement2',
        urlPattern: '',
        isRegex: false
      })
    ).rejects.toThrow();
  });
});
