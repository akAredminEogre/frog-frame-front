/**
 * delete-rule 結合テスト - 正常系
 * Factory → Controller → UseCase → Repository → DB → Presenter の一連フローを検証
 *
 * 1. ルールID指定で削除、getByIdで取得失敗を確認
 * 2. 削除後にgetAllで該当ルールが含まれないことを確認
 */
import 'tests/integration/delete-rule/setup';

import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/createMockTabsGateway';
import { createTestRule } from 'tests/integration/delete-rule/helpers/createTestRule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DeleteRuleControllerFactory } from 'src/interface-adapters/factories/DeleteRuleControllerFactory';

describe('delete-rule 結合テスト - 正常系', () => {
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

  it('ルールID指定で削除、getByIdで取得失敗を確認', async () => {
    // Arrange: DBにテストデータを挿入
    const initialRule = createTestRule({
      oldString: 'pattern-to-delete',
      urlPattern: 'https://example.com',
      isActive: true,
    });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act: Controller経由で削除操作
    await controller.deleteRule(ruleInDb.id);

    // Assert: DBからルールが削除されている（getByIdがエラーを投げる）
    await expect(repository.getById(ruleInDb.id)).rejects.toThrow(RewriteRuleNotFoundError);

    // Assert: 成功コールバックが呼ばれる
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(ruleInDb.id);

    // Assert: TabsGatewayが呼ばれる
    expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(1);

    // Assert: エラーコールバックは呼ばれない
    expect(onError).not.toHaveBeenCalled();
  });

  it('削除後にgetAllで該当ルールが含まれないことを確認', async () => {
    // Arrange: DBにテストデータを挿入
    const initialRule = createTestRule({
      oldString: 'pattern-to-delete',
      urlPattern: 'https://example.com',
      isActive: true,
    });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, mockTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act: Controller経由で削除操作
    await controller.deleteRule(ruleInDb.id);

    // Assert: getAllで空の結果が返る
    const remainingRules = await repository.getAll();
    expect(remainingRules.toArray()).toHaveLength(0);
  });
});
