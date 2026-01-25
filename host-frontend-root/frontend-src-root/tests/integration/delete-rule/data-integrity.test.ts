/**
 * delete-rule 結合テスト - データ整合性
 * Factory → Controller → DB までのデータフローが整合していることを検証
 *
 * 1. ルールA削除後、ルールBが正常に取得できる（他ルール不変）
 * 2. 削除前後で件数が1減少することを確認（全件数確認）
 */
import 'tests/integration/delete-rule/setup';

import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/createMockTabsGateway';
import { createTestRule } from 'tests/integration/delete-rule/helpers/createTestRule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { IDeleteRuleController } from 'src/interface-adapters/controllers/IDeleteRuleController';
import { DeleteRuleControllerFactory } from 'src/interface-adapters/factories/DeleteRuleControllerFactory';

describe('delete-rule 結合テスト - データ整合性', () => {
  let repository: DexieRewriteRuleRepository;
  let mockTabsGateway: ITabsGateway;
  let controller: IDeleteRuleController;

  beforeEach(async () => {
    vi.clearAllMocks();
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
    mockTabsGateway = createMockTabsGateway();

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    controller = factory.create(vi.fn(), vi.fn());
  });

  it('ルールA削除後、ルールBが正常に取得できる', async () => {
    // Arrange: 2つのルールを作成
    const ruleA = createTestRule({
      oldString: 'ruleA-old',
      newString: 'ruleA-new',
      urlPattern: 'https://siteA.com',
      isRegex: false,
      isActive: true,
    });
    const ruleB = createTestRule({
      oldString: 'ruleB-old',
      newString: 'ruleB-new',
      urlPattern: 'https://siteB.com',
      isRegex: true,
      isActive: false,
    });

    await repository.create(ruleA);
    await repository.create(ruleB);

    const createdRules = await repository.getAll();
    const rulesArray = createdRules.toArray();
    const ruleAInDb = rulesArray.find((r) => r.oldString === 'ruleA-old')!;
    const ruleBInDb = rulesArray.find((r) => r.oldString === 'ruleB-old')!;

    // Act: ルールAを削除
    await controller.deleteRule(ruleAInDb.id);

    // Assert: ルールBは正常に取得できる
    const ruleBAfterDelete = await repository.getById(ruleBInDb.id);
    expect(ruleBAfterDelete.id).toBe(ruleBInDb.id);
    expect(ruleBAfterDelete.oldString).toBe('ruleB-old');
    expect(ruleBAfterDelete.newString).toBe('ruleB-new');
    expect(ruleBAfterDelete.urlPattern).toBe('https://siteB.com');
    expect(ruleBAfterDelete.isRegex).toBe(true);
    expect(ruleBAfterDelete.isActive).toBe(false);
  });

  it('削除前後で件数が1減少することを確認', async () => {
    // Arrange: 3つのルールを作成
    const rule1 = createTestRule({
      oldString: 'rule1-old',
      isActive: true,
    });
    const rule2 = createTestRule({
      oldString: 'rule2-old',
      isActive: true,
    });
    const rule3 = createTestRule({
      oldString: 'rule3-old',
      isActive: false,
    });

    await repository.create(rule1);
    await repository.create(rule2);
    await repository.create(rule3);

    const rulesBefore = await repository.getAll();
    const countBefore = rulesBefore.toArray().length;
    expect(countBefore).toBe(3);

    const ruleToDelete = rulesBefore.toArray().find((r) => r.oldString === 'rule2-old')!;

    // Act: 1つのルールを削除
    await controller.deleteRule(ruleToDelete.id);

    // Assert: 件数が1減少
    const rulesAfter = await repository.getAll();
    const countAfter = rulesAfter.toArray().length;
    expect(countAfter).toBe(countBefore - 1);
    expect(countAfter).toBe(2);

    // Assert: 残りのルールが正しい
    const remainingOldStrings = rulesAfter.toArray().map((r) => r.oldString);
    expect(remainingOldStrings).toContain('rule1-old');
    expect(remainingOldStrings).toContain('rule3-old');
    expect(remainingOldStrings).not.toContain('rule2-old');
  });

  it('他のルールのプロパティが変更されない', async () => {
    // Arrange: 2つのルールを作成
    const ruleToDelete = createTestRule({
      oldString: 'delete-me',
      newString: 'delete-new',
      urlPattern: 'https://delete.com',
      isRegex: false,
      isActive: true,
    });
    const ruleToKeep = createTestRule({
      oldString: 'keep-me',
      newString: 'keep-new',
      urlPattern: 'https://keep.com',
      isRegex: true,
      isActive: false,
    });

    await repository.create(ruleToDelete);
    await repository.create(ruleToKeep);

    const createdRules = await repository.getAll();
    const rulesArray = createdRules.toArray();
    const deleteTarget = rulesArray.find((r) => r.oldString === 'delete-me')!;
    const keepTarget = rulesArray.find((r) => r.oldString === 'keep-me')!;

    // Act: 1つのルールを削除
    await controller.deleteRule(deleteTarget.id);

    // Assert: 残ったルールのプロパティが完全に保持される
    const keptRule = await repository.getById(keepTarget.id);
    expect(keptRule.oldString).toBe('keep-me');
    expect(keptRule.newString).toBe('keep-new');
    expect(keptRule.urlPattern).toBe('https://keep.com');
    expect(keptRule.isRegex).toBe(true);
    expect(keptRule.isActive).toBe(false);
  });
});
