/**
 * delete-rule 結合テスト - Presenter出力整合性
 * Factory → Controller → Presenterを通じてView層に正しいデータが渡されることを検証
 *
 * 1. 削除成功時にonSuccessコールバックが呼ばれる
 * 2. onSuccessに削除されたruleIdが含まれる
 */
import 'tests/integration/delete-rule/setup';

import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/createMockTabsGateway';
import { createTestRule } from 'tests/integration/delete-rule/helpers/createTestRule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DeleteRuleControllerFactory } from 'src/interface-adapters/factories/DeleteRuleControllerFactory';

describe('delete-rule 結合テスト - Presenter出力整合性', () => {
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

  it('削除成功時にonSuccessコールバックが正確に1回呼び出される', async () => {
    // Arrange
    const initialRule = createTestRule({ isActive: true });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act
    await controller.deleteRule(ruleInDb.id);

    // Assert
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });

  it('onSuccessに削除されたruleIdが渡される', async () => {
    // Arrange
    const initialRule = createTestRule({
      oldString: 'testOld',
      newString: 'testNew',
      urlPattern: 'https://test.com',
      isRegex: false,
      isActive: true,
    });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act
    await controller.deleteRule(ruleInDb.id);

    // Assert
    expect(onSuccess).toHaveBeenCalledWith(ruleInDb.id);
  });

  it('複数ルールから1つ削除時、削除されたruleIdのみがonSuccessに渡される', async () => {
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

    const createdRules = await repository.getAll();
    const rulesArray = createdRules.toArray();
    const ruleToDelete = rulesArray.find((r) => r.oldString === 'rule2-old')!;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act
    await controller.deleteRule(ruleToDelete.id);

    // Assert: 削除されたruleIdのみが渡される
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(ruleToDelete.id);
  });

  it('TabsGatewayが削除されたルールで呼び出される', async () => {
    // Arrange
    const initialRule = createTestRule({
      urlPattern: 'https://reload-target.com',
      isActive: true,
    });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act
    await controller.deleteRule(ruleInDb.id);

    // Assert: TabsGatewayが呼ばれる
    expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(1);
    expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledWith(
      expect.objectContaining({
        id: ruleInDb.id,
        urlPattern: 'https://reload-target.com',
      })
    );
  });
});
