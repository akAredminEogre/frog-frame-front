/**
 * toggle-rule-active 結合テスト - エラー系
 * Factory → Controller経由で存在しないルールIDを指定した場合のエラーハンドリングを検証
 *
 * 1. 存在しないruleIdでエラーコールバックが呼ばれる
 * 2. エラー時にDBが変更されない
 */
import 'tests/integration/toggle-rule-active/setup';

import { createTestRule } from 'tests/integration/toggle-rule-active/helpers/createTestRule';
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
import { ToggleRuleActiveControllerFactory } from 'src/interface-adapters/factories/ToggleRuleActiveControllerFactory';

describe('toggle-rule-active 結合テスト - エラー系', () => {
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

  it('存在しないruleIdでエラーコールバックが呼ばれる', async () => {
    // Arrange: DBは空のまま
    const nonExistentRuleId = 99999;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      mockTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act
    await controller.toggleActive(nonExistentRuleId);

    // Assert
    expect(showErrorInView).toHaveBeenCalledTimes(1);
    expect(showErrorInView).toHaveBeenCalledWith(
      nonExistentRuleId,
      expect.stringContaining('99999')
    );
    expect(updateRuleInView).not.toHaveBeenCalled();
    expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();
  });

  it('存在するルールがある状態で存在しないIDを指定するとエラーコールバックが呼ばれる', async () => {
    // Arrange: 1つのルールを作成
    const existingRule = createTestRule({ isActive: true });
    await repository.create(existingRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];
    const nonExistentRuleId = ruleInDb.id + 1000;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      mockTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act
    await controller.toggleActive(nonExistentRuleId);

    // Assert
    expect(showErrorInView).toHaveBeenCalledTimes(1);
    expect(updateRuleInView).not.toHaveBeenCalled();
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
    const rulesArrayBefore = createdRules.toArray();
    const nonExistentRuleId = 99999;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      mockTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act: 存在しないIDでトグル試行
    await controller.toggleActive(nonExistentRuleId);

    // Assert: DBの状態が変更されていない
    const rulesAfter = await repository.getAll();
    const rulesArrayAfter = rulesAfter.toArray();

    expect(rulesArrayAfter).toHaveLength(rulesArrayBefore.length);

    const rule1After = rulesArrayAfter.find((r) => r.oldString === 'rule1-old')!;
    const rule2After = rulesArrayAfter.find((r) => r.oldString === 'rule2-old')!;

    expect(rule1After.isActive).toBe(true);
    expect(rule2After.isActive).toBe(false);
  });

  it('エラー時にTabsGatewayが呼ばれない', async () => {
    // Arrange
    const nonExistentRuleId = 99999;

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      mockTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act
    await controller.toggleActive(nonExistentRuleId);

    // Assert
    expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();
  });
});
