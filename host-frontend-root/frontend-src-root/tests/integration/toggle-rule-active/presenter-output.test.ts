/**
 * toggle-rule-active 結合テスト - Presenter出力整合性
 * Factory → Controller → Presenterを通じてView層に正しいデータが渡されることを検証
 *
 * 1. updateRuleInViewコールバックが呼び出される
 * 2. コールバックに渡されるルールが更新後の状態
 */
import 'tests/integration/toggle-rule-active/setup';

import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/createMockTabsGateway';
import { createTestRule } from 'tests/integration/toggle-rule-active/helpers/createTestRule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { ToggleRuleActiveControllerFactory } from 'src/interface-adapters/factories/ToggleRuleActiveControllerFactory';

describe('toggle-rule-active 結合テスト - Presenter出力整合性', () => {
  let repository: DexieRewriteRuleRepository;
  let mockTabsGateway: ITabsGateway;
  let updateRuleInView: ReturnType<typeof vi.fn>;
  let showErrorInView: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
    mockTabsGateway = createMockTabsGateway();
    updateRuleInView = vi.fn();
    showErrorInView = vi.fn();
  });

  it('updateRuleInViewコールバックが正確に1回呼び出される', async () => {
    // Arrange
    const initialRule = createTestRule({ isActive: true });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      mockTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act
    await controller.toggleActive(ruleInDb.id);

    // Assert
    expect(updateRuleInView).toHaveBeenCalledTimes(1);
    expect(showErrorInView).not.toHaveBeenCalled();
  });

  it('コールバックに渡されるルールが更新後の状態を持つ（true→false）', async () => {
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
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      mockTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act
    await controller.toggleActive(ruleInDb.id);

    // Assert
    const callbackArg = updateRuleInView.mock.calls[0][0] as RewriteRule;
    expect(callbackArg.id).toBe(ruleInDb.id);
    expect(callbackArg.oldString).toBe('testOld');
    expect(callbackArg.newString).toBe('testNew');
    expect(callbackArg.urlPattern).toBe('https://test.com');
    expect(callbackArg.isRegex).toBe(false);
    expect(callbackArg.isActive).toBe(false); // true→false に変更
  });

  it('コールバックに渡されるルールが更新後の状態を持つ（false→true）', async () => {
    // Arrange
    const initialRule = createTestRule({
      oldString: 'inactiveOld',
      newString: 'inactiveNew',
      urlPattern: 'https://inactive.com',
      isRegex: true,
      isActive: false,
    });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      mockTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act
    await controller.toggleActive(ruleInDb.id);

    // Assert
    const callbackArg = updateRuleInView.mock.calls[0][0] as RewriteRule;
    expect(callbackArg.id).toBe(ruleInDb.id);
    expect(callbackArg.oldString).toBe('inactiveOld');
    expect(callbackArg.newString).toBe('inactiveNew');
    expect(callbackArg.urlPattern).toBe('https://inactive.com');
    expect(callbackArg.isRegex).toBe(true);
    expect(callbackArg.isActive).toBe(true); // false→true に変更
  });

  it('コールバックに渡されるルールとDBの状態が一致する', async () => {
    // Arrange
    const initialRule = createTestRule({ isActive: true });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      mockTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act
    await controller.toggleActive(ruleInDb.id);

    // Assert: コールバックとDBの状態を比較
    const callbackArg = updateRuleInView.mock.calls[0][0] as RewriteRule;
    const updatedRuleInDb = await repository.getById(ruleInDb.id);

    expect(callbackArg.id).toBe(updatedRuleInDb.id);
    expect(callbackArg.oldString).toBe(updatedRuleInDb.oldString);
    expect(callbackArg.newString).toBe(updatedRuleInDb.newString);
    expect(callbackArg.urlPattern).toBe(updatedRuleInDb.urlPattern);
    expect(callbackArg.isRegex).toBe(updatedRuleInDb.isRegex);
    expect(callbackArg.isActive).toBe(updatedRuleInDb.isActive);
  });
});
