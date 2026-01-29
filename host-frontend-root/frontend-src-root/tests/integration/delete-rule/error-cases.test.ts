/**
 * delete-rule 結合テスト - エラー系
 * Factory → Controller経由で存在しないルールIDを指定した場合のエラーハンドリングを検証
 *
 * 1. 存在しないruleIdでonErrorコールバックが呼ばれる
 * 2. エラー時にDBが変更されない
 * 3. エラー時にTabsGatewayが呼ばれない
 */
import 'tests/integration/delete-rule/setup';

import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/createMockTabsGateway';
import { createTestRule } from 'tests/integration/delete-rule/helpers/createTestRule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DeleteRuleControllerFactory } from 'src/interface-adapters/factories/DeleteRuleControllerFactory';

describe('delete-rule 結合テスト - エラー系', () => {
  let repository: DexieRewriteRuleRepository;
  let mockTabsGateway: ITabsGateway;
  let onSuccess: ReturnType<typeof vi.fn>;
  let onError: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
    mockTabsGateway = createMockTabsGateway();
    onSuccess = vi.fn();
    onError = vi.fn();
  });

  it('存在しないruleIdでonErrorコールバックが呼ばれる', async () => {
    // Arrange: DBは空のまま
    const nonExistentRuleId = 99999;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act
    await controller.deleteRule(nonExistentRuleId);

    // Assert
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining(String(nonExistentRuleId))
    );
    expect(onSuccess).not.toHaveBeenCalled();
    expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();
  });

  it('存在するルールがある状態で存在しないIDを指定するとonErrorコールバックが呼ばれる', async () => {
    // Arrange: 1つのルールを作成
    const existingRule = createTestRule({ isActive: true });
    await repository.create(existingRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];
    const nonExistentRuleId = ruleInDb.id + 1000;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act
    await controller.deleteRule(nonExistentRuleId);

    // Assert
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('エラー時に既存のDBデータが変更されない', async () => {
    // Arrange: 複数のルールを作成
    const rule1 = createTestRule({
      oldString: 'rule1-old',
      isActive: true,
    });
    const rule2 = createTestRule({
      oldString: 'rule2-old',
      isActive: false,
    });

    await repository.create(rule1);
    await repository.create(rule2);

    const createdRules = await repository.getAll();
    const countBefore = createdRules.toArray().length;
    const nonExistentRuleId = 99999;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act: 存在しないIDで削除試行
    await controller.deleteRule(nonExistentRuleId);

    // Assert: DBの状態が変更されていない
    const rulesAfter = await repository.getAll();
    const rulesArrayAfter = rulesAfter.toArray();

    expect(rulesArrayAfter).toHaveLength(countBefore);

    const rule1After = rulesArrayAfter.find((r) => r.oldString === 'rule1-old')!;
    const rule2After = rulesArrayAfter.find((r) => r.oldString === 'rule2-old')!;

    expect(rule1After.isActive).toBe(true);
    expect(rule2After.isActive).toBe(false);
  });

  it('エラー時にTabsGatewayが呼ばれない', async () => {
    // Arrange
    const nonExistentRuleId = 99999;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act
    await controller.deleteRule(nonExistentRuleId);

    // Assert
    expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();
  });

  it('エラーメッセージにruleIdが含まれる', async () => {
    // Arrange
    const nonExistentRuleId = 12345;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act
    await controller.deleteRule(nonExistentRuleId);

    // Assert: エラーメッセージにIDが含まれる
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('12345')
    );
  });
});
