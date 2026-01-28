import { beforeEach, describe, expect, it, vi } from 'vitest';
import 'fake-indexeddb/auto';

import { DeleteRuleInteractor } from 'src/application-business-rules/use-cases/delete-rule/DeleteRuleInteractor';
import { RewriteRuleRepository } from 'src/frameworks-and-drivers/db/RewriteRuleRepository';
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { createTestRule } from './helpers/createTestRule';

describe('Delete Rule - Normal Cases', () => {
  let deleteRuleInteractor: DeleteRuleInteractor;
  let repository: RewriteRuleRepository;
  let mockTabsGateway: ReturnType<typeof createMockTabsGateway>;
  let mockPresent: ReturnType<typeof vi.fn>;
  let mockPresentError: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Repository初期化（fake-indexeddbを使用）
    repository = new RewriteRuleRepository();
    await repository.initialize();

    // TabsGateway モック作成（成功ケース）
    mockTabsGateway = createMockTabsGateway();

    // Presenterコールバック モック作成
    mockPresent = vi.fn();
    mockPresentError = vi.fn();

    // DeleteRuleInteractor インスタンス作成
    deleteRuleInteractor = new DeleteRuleInteractor(
      repository,
      mockTabsGateway,
      mockPresent,
      mockPresentError
    );
  });

  describe('基本削除機能', () => {
    it('ルールID指定で削除が成功し、getByIdで取得失敗することを確認', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ 
        id: 1, 
        urlPattern: 'https://example.com/*'
      });
      await repository.save(testRule);

      // 削除前に存在することを確認
      const beforeDelete = await repository.getById(1);
      expect(beforeDelete).toBeDefined();
      expect(beforeDelete!.id).toBe(1);

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: 削除後に取得失敗することを確認
      const afterDelete = await repository.getById(1);
      expect(afterDelete).toBeNull();

      // Presenterが正常に呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledTimes(1);
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 1 });
      expect(mockPresentError).not.toHaveBeenCalled();

      // TabsGatewayが正常に呼ばれることを確認
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(1);
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledWith('https://example.com/*');
    });

    it('削除後にgetAllで該当ルールが含まれないことを確認', async () => {
      // Arrange: 複数のテストルールを作成・保存
      const rule1 = createTestRule({ 
        id: 1, 
        urlPattern: 'https://example.com/*'
      });
      const rule2 = createTestRule({ 
        id: 2, 
        urlPattern: 'https://other.com/*'
      });
      await repository.save(rule1);
      await repository.save(rule2);

      // 削除前に2件存在することを確認
      const beforeDelete = await repository.getAll();
      expect(beforeDelete).toHaveLength(2);
      expect(beforeDelete.map(r => r.id)).toContain(1);
      expect(beforeDelete.map(r => r.id)).toContain(2);

      // Act: ルール1を削除
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: 削除後に1件のみ残ることを確認
      const afterDelete = await repository.getAll();
      expect(afterDelete).toHaveLength(1);
      expect(afterDelete[0].id).toBe(2);
      expect(afterDelete.map(r => r.id)).not.toContain(1);

      // Presenterが正常に呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledTimes(1);
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 1 });
      expect(mockPresentError).not.toHaveBeenCalled();
    });

    it('URLパターンが特殊文字を含む場合でも削除が成功すること', async () => {
      // Arrange: 特殊文字を含むURLパターンのルールを作成
      const testRule = createTestRule({ 
        id: 3,
        urlPattern: 'https://example.com/path?query=value&special=[{}]'
      });
      await repository.save(testRule);

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 3 });

      // Assert: 削除が成功することを確認
      const afterDelete = await repository.getById(3);
      expect(afterDelete).toBeNull();

      // TabsGatewayが正しいURLパターンで呼ばれることを確認
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledWith(
        'https://example.com/path?query=value&special=[{}]'
      );

      // Presenterが正常に呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 3 });
    });

    it('正規表現フラグがtrueのルールでも削除が成功すること', async () => {
      // Arrange: 正規表現ルールを作成・保存
      const regexRule = createTestRule({ 
        id: 4,
        urlPattern: 'https://.*\\.example\\.com/.*',
        isRegex: true
      });
      await repository.save(regexRule);

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 4 });

      // Assert: 削除が成功することを確認
      const afterDelete = await repository.getById(4);
      expect(afterDelete).toBeNull();

      // TabsGatewayが正しいURLパターンで呼ばれることを確認
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledWith(
        'https://.*\\.example\\.com/.*'
      );

      // Presenterが正常に呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 4 });
    });

    it('非アクティブなルールでも削除が成功すること', async () => {
      // Arrange: 非アクティブルールを作成・保存
      const inactiveRule = createTestRule({ 
        id: 5,
        urlPattern: 'https://inactive.com/*',
        isActive: false
      });
      await repository.save(inactiveRule);

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 5 });

      // Assert: 削除が成功することを確認
      const afterDelete = await repository.getById(5);
      expect(afterDelete).toBeNull();

      // TabsGatewayが正しいURLパターンで呼ばれることを確認
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledWith(
        'https://inactive.com/*'
      );

      // Presenterが正常に呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 5 });
    });
  });

  describe('連続削除操作', () => {
    it('複数のルールを連続で削除できること', async () => {
      // Arrange: 複数のテストルールを作成・保存
      const rules = [
        createTestRule({ id: 10, urlPattern: 'https://site1.com/*' }),
        createTestRule({ id: 11, urlPattern: 'https://site2.com/*' }),
        createTestRule({ id: 12, urlPattern: 'https://site3.com/*' }),
      ];
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // 初期状態で3件存在することを確認
      const initial = await repository.getAll();
      expect(initial).toHaveLength(3);

      // Act: 3つのルールを順次削除
      await deleteRuleInteractor.execute({ ruleId: 10 });
      await deleteRuleInteractor.execute({ ruleId: 11 });
      await deleteRuleInteractor.execute({ ruleId: 12 });

      // Assert: 全て削除されることを確認
      const afterDelete = await repository.getAll();
      expect(afterDelete).toHaveLength(0);

      // Presenterが3回正常に呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledTimes(3);
      expect(mockPresent).toHaveBeenNthCalledWith(1, { deletedRuleId: 10 });
      expect(mockPresent).toHaveBeenNthCalledWith(2, { deletedRuleId: 11 });
      expect(mockPresent).toHaveBeenNthCalledWith(3, { deletedRuleId: 12 });

      // TabsGatewayが3回正常に呼ばれることを確認
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(3);
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenNthCalledWith(1, 'https://site1.com/*');
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenNthCalledWith(2, 'https://site2.com/*');
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenNthCalledWith(3, 'https://site3.com/*');

      expect(mockPresentError).not.toHaveBeenCalled();
    });
  });
});