/**
 * toggle-rule-active 結合テスト - 正常系
 * Factory → Controller → UseCase → Repository → DB → Presenter の一連フローを検証
 *
 * 1. isActive=true のルールを false に切り替え
 * 2. isActive=false のルールを true に切り替え
 */
import 'tests/integration/toggle-rule-active/setup';

import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { createTestRule } from 'tests/integration/toggle-rule-active/helpers/createTestRule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
import { ToggleRuleActiveControllerFactory } from 'src/interface-adapters/factories/ToggleRuleActiveControllerFactory';

describe('toggle-rule-active 結合テスト - 正常系', () => {
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

  const testCases: Array<{
    description: string;
    initialIsActive: boolean;
    expectedIsActive: boolean;
  }> = [
    {
      description: 'isActive=true のルールを false に切り替え',
      initialIsActive: true,
      expectedIsActive: false,
    },
    {
      description: 'isActive=false のルールを true に切り替え',
      initialIsActive: false,
      expectedIsActive: true,
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange: DBにテストデータを挿入
      const initialRule = createTestRule({ isActive: testCase.initialIsActive });
      await repository.create(initialRule);
      const createdRules = await repository.getAll();
      const ruleInDb = createdRules.toArray()[0];

      // Factory経由でControllerを取得（UIと同じフロー）
      const factory = new ToggleRuleActiveControllerFactory(
        repository,
        mockTabsGateway
      );
      const controller = factory.create(updateRuleInView, showErrorInView);

      // Act: Controller経由でトグル操作
      await controller.toggleActive(ruleInDb.id);

      // Assert: DBの状態を検証
      const updatedRuleInDb = await repository.getById(ruleInDb.id);
      expect(updatedRuleInDb.isActive).toBe(testCase.expectedIsActive);

      // Assert: Presenterコールバックが正しく呼ばれる
      expect(updateRuleInView).toHaveBeenCalledTimes(1);
      const callbackArg = updateRuleInView.mock.calls[0][0] as RewriteRule;
      expect(callbackArg.isActive).toBe(testCase.expectedIsActive);

      // Assert: TabsGatewayが呼ばれる
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(1);

      // Assert: エラーコールバックは呼ばれない
      expect(showErrorInView).not.toHaveBeenCalled();
    });
  });
});
