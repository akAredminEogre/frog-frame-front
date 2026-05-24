/**
 * delete-rule 結合テスト - 部分的成功
 * ルール削除成功後にタブリロードが失敗した場合の挙動を検証
 *
 * DeleteRuleInteractorの実装より:
 * - 削除成功後、tabsGateway.reloadMatchingTabs()の前にpresenter.present()を呼び出す
 * - これにより、タブリロードが失敗しても削除成功をUIに反映できる
 *
 * 部分的成功の挙動:
 * 1. onSuccessが呼ばれる（削除成功を通知）
 * 2. onErrorが呼ばれる（タブリロード失敗を通知）
 * 3. DBからはルールが削除されている
 */
import 'tests/integration/delete-rule/setup';

import { createFailingTabsGatewayMock } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createFailingTabsGatewayMock';
import { createTestRule } from 'tests/integration/delete-rule/helpers/createTestRule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DeleteRuleControllerFactory } from 'src/interface-adapters/factories/DeleteRuleControllerFactory';

describe('delete-rule 結合テスト - 部分的成功（タブリロード失敗）', () => {
  let repository: DexieRewriteRuleRepository;
  let onSuccess: ReturnType<typeof vi.fn>;
  let onError: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
    onSuccess = vi.fn();
    onError = vi.fn();
  });

  it('タブリロード失敗時もonSuccessが呼ばれる（削除は成功）', async () => {
    // Arrange: DBにテストデータを挿入
    const initialRule = createTestRule({ isActive: true });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // タブリロード失敗をシミュレートするモック
    const failingTabsGateway = createFailingTabsGatewayMock('Tab reload failed');

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, failingTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act: Controller経由で削除操作
    await controller.deleteRule(ruleInDb.id);

    // Assert: onSuccessが呼ばれる
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(ruleInDb.id);
  });

  it('タブリロード失敗のエラーメッセージがonErrorで通知される', async () => {
    // Arrange: DBにテストデータを挿入
    const initialRule = createTestRule({ isActive: true });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // タブリロード失敗をシミュレートするモック
    const errorMessage = 'Failed to reload tabs';
    const failingTabsGateway = createFailingTabsGatewayMock(errorMessage);

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, failingTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act: Controller経由で削除操作
    await controller.deleteRule(ruleInDb.id);

    // Assert: onErrorが呼ばれ、エラーメッセージが渡される
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining(errorMessage)
    );
  });

  it('タブリロード失敗してもDBからはルールが削除されている', async () => {
    // Arrange: DBにテストデータを挿入
    const initialRule = createTestRule({
      oldString: 'testOld',
      newString: 'testNew',
      isActive: true,
    });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // タブリロード失敗をシミュレートするモック
    const failingTabsGateway = createFailingTabsGatewayMock('Tab reload failed');

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, failingTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act: Controller経由で削除操作
    await controller.deleteRule(ruleInDb.id);

    // Assert: DBからルールが削除されている
    await expect(repository.getById(ruleInDb.id)).rejects.toThrow(RewriteRuleNotFoundError);

    // Assert: getAllでも空
    const remainingRules = await repository.getAll();
    expect(remainingRules.toArray()).toHaveLength(0);
  });

  it('onSuccessとonErrorの両方が呼ばれる（部分的成功の定義）', async () => {
    // Arrange: DBにテストデータを挿入
    const initialRule = createTestRule({ isActive: true });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // タブリロード失敗をシミュレートするモック
    const failingTabsGateway = createFailingTabsGatewayMock('Network error');

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, failingTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act: Controller経由で削除操作
    await controller.deleteRule(ruleInDb.id);

    // Assert: 両方のコールバックが呼ばれる
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);

    // Assert: onSuccessには削除されたruleIdが渡される
    expect(onSuccess).toHaveBeenCalledWith(ruleInDb.id);

    // Assert: onErrorにはフォーマット済みエラーメッセージが渡される
    expect(onError).toHaveBeenCalledWith(expect.any(String));
  });

  it('複数ルールがある場合、削除対象のみが削除され他は影響を受けない', async () => {
    // Arrange: 2つのルールを作成
    const ruleToDelete = createTestRule({
      oldString: 'delete-me',
      isActive: true,
    });
    const ruleToKeep = createTestRule({
      oldString: 'keep-me',
      isActive: false,
    });

    await repository.create(ruleToDelete);
    await repository.create(ruleToKeep);

    const createdRules = await repository.getAll();
    const rulesArray = createdRules.toArray();
    const deleteTarget = rulesArray.find((r) => r.oldString === 'delete-me')!;
    const keepTarget = rulesArray.find((r) => r.oldString === 'keep-me')!;

    // タブリロード失敗をシミュレートするモック
    const failingTabsGateway = createFailingTabsGatewayMock('Tab reload failed');

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new DeleteRuleControllerFactory(repository, failingTabsGateway);
    const controller = factory.create(onSuccess, onError);

    // Act: Controller経由で削除操作
    await controller.deleteRule(deleteTarget.id);

    // Assert: 削除対象は削除されている
    await expect(repository.getById(deleteTarget.id)).rejects.toThrow(RewriteRuleNotFoundError);

    // Assert: 他のルールは影響を受けない
    const keptRule = await repository.getById(keepTarget.id);
    expect(keptRule.oldString).toBe('keep-me');
    expect(keptRule.isActive).toBe(false);

    // Assert: 件数が1減少
    const remainingRules = await repository.getAll();
    expect(remainingRules.toArray()).toHaveLength(1);
  });
});
