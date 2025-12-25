/**
 * toggle-rule-active 結合テスト - データ整合性
 * Factory → Controller → DB までのデータフローが整合していることを検証
 *
 * 1. 入力ruleIdと保存されたルールのIDが一致
 * 2. isActive以外のプロパティが変更されない
 * 3. 他のルールが影響を受けない
 */
import 'tests/integration/toggle-rule-active/setup';

import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { createTestRule } from 'tests/integration/toggle-rule-active/helpers/createTestRule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { IToggleRuleActiveController } from 'src/interface-adapters/controllers/IToggleRuleActiveController';
import { ToggleRuleActiveControllerFactory } from 'src/interface-adapters/factories/ToggleRuleActiveControllerFactory';

describe('toggle-rule-active 結合テスト - データ整合性', () => {
  let repository: DexieRewriteRuleRepository;
  let mockTabsGateway: ITabsGateway;
  let controller: IToggleRuleActiveController;

  beforeEach(async () => {
    vi.clearAllMocks();
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
    mockTabsGateway = createMockTabsGateway();

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      mockTabsGateway
    );
    controller = factory.create(vi.fn(), vi.fn());
  });

  it('入力ruleIdと保存されたルールのIDが一致する', async () => {
    // Arrange
    const initialRule = createTestRule({ isActive: true });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];
    const targetRuleId = ruleInDb.id;

    // Act
    await controller.toggleActive(targetRuleId);

    // Assert
    const updatedRuleInDb = await repository.getById(targetRuleId);
    expect(updatedRuleInDb.id).toBe(targetRuleId);
  });

  it('isActive以外のプロパティが変更されない', async () => {
    // Arrange
    const initialRule = createTestRule({
      oldString: 'originalOld',
      newString: 'originalNew',
      urlPattern: 'https://original.com',
      isRegex: true,
      isActive: true,
    });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // Act
    await controller.toggleActive(ruleInDb.id);

    // Assert
    const updatedRuleInDb = await repository.getById(ruleInDb.id);
    expect(updatedRuleInDb.oldString).toBe('originalOld');
    expect(updatedRuleInDb.newString).toBe('originalNew');
    expect(updatedRuleInDb.urlPattern).toBe('https://original.com');
    expect(updatedRuleInDb.isRegex).toBe(true);
    // isActiveのみ変更
    expect(updatedRuleInDb.isActive).toBe(false);
  });

  it('他のルールが影響を受けない', async () => {
    // Arrange: 3つのルールを作成
    const rule1 = createTestRule({
      oldString: 'rule1-old',
      newString: 'rule1-new',
      isActive: true,
    });
    const rule2 = createTestRule({
      oldString: 'rule2-old',
      newString: 'rule2-new',
      isActive: true,
    });
    const rule3 = createTestRule({
      oldString: 'rule3-old',
      newString: 'rule3-new',
      isActive: false,
    });

    await repository.create(rule1);
    await repository.create(rule2);
    await repository.create(rule3);

    const createdRules = await repository.getAll();
    const rulesArray = createdRules.toArray();
    const targetRule = rulesArray.find((r) => r.oldString === 'rule2-old')!;
    const otherRule1 = rulesArray.find((r) => r.oldString === 'rule1-old')!;
    const otherRule3 = rulesArray.find((r) => r.oldString === 'rule3-old')!;

    // Act: rule2のみトグル
    await controller.toggleActive(targetRule.id);

    // Assert: rule2のisActiveが変更
    const updatedRule2 = await repository.getById(targetRule.id);
    expect(updatedRule2.isActive).toBe(false);

    // Assert: 他のルールは変更されない
    const updatedRule1 = await repository.getById(otherRule1.id);
    const updatedRule3 = await repository.getById(otherRule3.id);
    expect(updatedRule1.isActive).toBe(true);
    expect(updatedRule1.oldString).toBe('rule1-old');
    expect(updatedRule3.isActive).toBe(false);
    expect(updatedRule3.oldString).toBe('rule3-old');

    // Assert: 全体のルール数が変わらない
    const allRules = await repository.getAll();
    expect(allRules.toArray()).toHaveLength(3);
  });
});
