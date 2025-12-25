/**
 * toggle-rule-active 結合テスト - 部分的成功
 * ルール更新成功後にタブリロードが失敗した場合の挙動を検証
 *
 * 00-overview.md「部分的成功の取り扱い」参照:
 * - UIの状態: トグル後の正しい状態を表示（ルール更新は成功しているため）
 * - エラー通知: タブリロード失敗のエラーメッセージを表示
 *
 * 1. タブリロード失敗時もUIはトグル後の状態を表示（onSuccessが呼ばれる）
 * 2. タブリロード失敗のエラーメッセージが表示される（onErrorが呼ばれる）
 * 3. タブリロード失敗してもDBは更新済み
 */
import 'tests/integration/toggle-rule-active/setup';

import { createFailingTabsGatewayMock } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createFailingTabsGatewayMock';
import { createTestRule } from 'tests/integration/toggle-rule-active/helpers/createTestRule';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
import { ToggleRuleActiveControllerFactory } from 'src/interface-adapters/factories/ToggleRuleActiveControllerFactory';

describe('toggle-rule-active 結合テスト - 部分的成功（タブリロード失敗）', () => {
  let repository: DexieRewriteRuleRepository;
  let updateRuleInView: ReturnType<typeof vi.fn>;
  let showErrorInView: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
    updateRuleInView = vi.fn();
    showErrorInView = vi.fn();
  });

  it('タブリロード失敗時もUIはトグル後の状態を表示（onSuccessが呼ばれる）', async () => {
    // Arrange: DBにテストデータを挿入
    const initialRule = createTestRule({ isActive: true });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // タブリロード失敗をシミュレートするモック
    const failingTabsGateway = createFailingTabsGatewayMock('Tab reload failed');

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      failingTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act: Controller経由でトグル操作
    await controller.toggleActive(ruleInDb.id);

    // Assert: onSuccessが呼ばれ、トグル後の状態が渡される
    expect(updateRuleInView).toHaveBeenCalledTimes(1);
    const callbackArg = updateRuleInView.mock.calls[0][0] as RewriteRule;
    expect(callbackArg.isActive).toBe(false); // true → false に変更
  });

  it('タブリロード失敗のエラーメッセージが表示される（onErrorが呼ばれる）', async () => {
    // Arrange: DBにテストデータを挿入
    const initialRule = createTestRule({ isActive: true });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // タブリロード失敗をシミュレートするモック
    const errorMessage = 'Failed to reload tabs';
    const failingTabsGateway = createFailingTabsGatewayMock(errorMessage);

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      failingTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act: Controller経由でトグル操作
    await controller.toggleActive(ruleInDb.id);

    // Assert: onErrorが呼ばれ、エラーメッセージが渡される
    expect(showErrorInView).toHaveBeenCalledTimes(1);
    expect(showErrorInView).toHaveBeenCalledWith(
      ruleInDb.id,
      expect.stringContaining(errorMessage)
    );
  });

  it('タブリロード失敗してもDBは更新済み', async () => {
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
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      failingTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act: Controller経由でトグル操作
    await controller.toggleActive(ruleInDb.id);

    // Assert: DBの状態が更新されている
    const updatedRuleInDb = await repository.getById(ruleInDb.id);
    expect(updatedRuleInDb.isActive).toBe(false); // true → false に変更
    expect(updatedRuleInDb.oldString).toBe('testOld');
    expect(updatedRuleInDb.newString).toBe('testNew');
  });

  it('onSuccessとonErrorの両方が呼ばれる（部分的成功の定義）', async () => {
    // Arrange: DBにテストデータを挿入
    const initialRule = createTestRule({ isActive: false });
    await repository.create(initialRule);
    const createdRules = await repository.getAll();
    const ruleInDb = createdRules.toArray()[0];

    // タブリロード失敗をシミュレートするモック
    const failingTabsGateway = createFailingTabsGatewayMock('Network error');

    // Factory経由でControllerを取得（UIと同じフロー）
    const factory = new ToggleRuleActiveControllerFactory(
      repository,
      failingTabsGateway
    );
    const controller = factory.create(updateRuleInView, showErrorInView);

    // Act: Controller経由でトグル操作
    await controller.toggleActive(ruleInDb.id);

    // Assert: 両方のコールバックが呼ばれる
    expect(updateRuleInView).toHaveBeenCalledTimes(1);
    expect(showErrorInView).toHaveBeenCalledTimes(1);

    // Assert: onSuccessには更新後のルールが渡される
    const successArg = updateRuleInView.mock.calls[0][0] as RewriteRule;
    expect(successArg.isActive).toBe(true); // false → true に変更

    // Assert: onErrorにはエラー情報が渡される
    expect(showErrorInView).toHaveBeenCalledWith(
      ruleInDb.id,
      expect.any(String)
    );
  });
});
