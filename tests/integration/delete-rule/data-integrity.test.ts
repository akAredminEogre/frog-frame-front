import { beforeEach, describe, expect, it, vi } from 'vitest';
import 'fake-indexeddb/auto';

import { DeleteRuleInteractor } from 'src/application-business-rules/use-cases/delete-rule/DeleteRuleInteractor';
import { RewriteRuleRepository } from 'src/frameworks-and-drivers/db/RewriteRuleRepository';
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { createTestRule } from './helpers/createTestRule';

describe('Delete Rule - Data Integrity', () => {
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

  describe('他ルールへの影響なし', () => {
    it('ルールA削除後、ルールBが正常に取得できること', async () => {
      // Arrange: 2つの異なるルールを作成・保存
      const ruleA = createTestRule({ 
        id: 1, 
        urlPattern: 'https://site-a.com/*',
        oldString: 'old-a',
        newString: 'new-a'
      });
      const ruleB = createTestRule({ 
        id: 2, 
        urlPattern: 'https://site-b.com/*',
        oldString: 'old-b', 
        newString: 'new-b'
      });
      
      await repository.save(ruleA);
      await repository.save(ruleB);

      // 削除前に両方存在することを確認
      const beforeDeleteA = await repository.getById(1);
      const beforeDeleteB = await repository.getById(2);
      expect(beforeDeleteA).toBeDefined();
      expect(beforeDeleteB).toBeDefined();

      // Act: ルールAを削除
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: ルールAは削除され、ルールBは正常に取得できることを確認
      const afterDeleteA = await repository.getById(1);
      const afterDeleteB = await repository.getById(2);
      
      expect(afterDeleteA).toBeNull();
      expect(afterDeleteB).toBeDefined();
      
      // ルールBの内容が変更されていないことを確認
      expect(afterDeleteB!.id).toBe(2);
      expect(afterDeleteB!.urlPattern).toBe('https://site-b.com/*');
      expect(afterDeleteB!.oldString).toBe('old-b');
      expect(afterDeleteB!.newString).toBe('new-b');
      expect(afterDeleteB!.isActive).toBe(true);

      // Presenterが正常に呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledTimes(1);
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 1 });
      expect(mockPresentError).not.toHaveBeenCalled();
    });

    it('複数ルール中の1つを削除しても他のルールが影響を受けないこと', async () => {
      // Arrange: 5つのルールを作成・保存
      const rules = [
        createTestRule({ id: 10, urlPattern: 'https://site1.com/*', oldString: 'old1' }),
        createTestRule({ id: 20, urlPattern: 'https://site2.com/*', oldString: 'old2' }),
        createTestRule({ id: 30, urlPattern: 'https://site3.com/*', oldString: 'old3' }),
        createTestRule({ id: 40, urlPattern: 'https://site4.com/*', oldString: 'old4' }),
        createTestRule({ id: 50, urlPattern: 'https://site5.com/*', oldString: 'old5' }),
      ];
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // 削除前に全てのルールの内容を確認
      const beforeDelete = await repository.getAll();
      expect(beforeDelete).toHaveLength(5);
      const sortedBeforeDelete = beforeDelete.sort((a, b) => a.id - b.id);
      
      expect(sortedBeforeDelete[0].oldString).toBe('old1');
      expect(sortedBeforeDelete[1].oldString).toBe('old2');
      expect(sortedBeforeDelete[2].oldString).toBe('old3');
      expect(sortedBeforeDelete[3].oldString).toBe('old4');
      expect(sortedBeforeDelete[4].oldString).toBe('old5');

      // Act: 中央のルール（ID: 30）を削除
      await deleteRuleInteractor.execute({ ruleId: 30 });

      // Assert: 他の4つのルールが影響を受けていないことを確認
      const afterDelete = await repository.getAll();
      expect(afterDelete).toHaveLength(4);
      
      const remainingIds = afterDelete.map(r => r.id).sort();
      expect(remainingIds).toEqual([10, 20, 40, 50]);

      // 残ったルールの内容が変更されていないことを確認
      for (const rule of afterDelete) {
        const expectedOldString = `old${rule.id / 10}`;
        expect(rule.oldString).toBe(expectedOldString);
      }

      // 削除されたルールは取得できないことを確認
      const deletedRule = await repository.getById(30);
      expect(deletedRule).toBeNull();
    });

    it('同じURLパターンを持つ別ルールに影響しないこと', async () => {
      // Arrange: 同じURLパターンだが異なるIDとoldString/newStringのルールを作成
      const rule1 = createTestRule({ 
        id: 1, 
        urlPattern: 'https://example.com/*',
        oldString: 'search1',
        newString: 'replace1'
      });
      const rule2 = createTestRule({ 
        id: 2, 
        urlPattern: 'https://example.com/*',
        oldString: 'search2', 
        newString: 'replace2'
      });
      
      await repository.save(rule1);
      await repository.save(rule2);

      // Act: rule1を削除
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: rule2は影響を受けずに存在することを確認
      const deletedRule = await repository.getById(1);
      const remainingRule = await repository.getById(2);
      
      expect(deletedRule).toBeNull();
      expect(remainingRule).toBeDefined();
      expect(remainingRule!.urlPattern).toBe('https://example.com/*');
      expect(remainingRule!.oldString).toBe('search2');
      expect(remainingRule!.newString).toBe('replace2');

      // 全体リストで1件のみ残ることを確認
      const allRules = await repository.getAll();
      expect(allRules).toHaveLength(1);
      expect(allRules[0].id).toBe(2);
    });
  });

  describe('件数の整合性', () => {
    it('削除前後で件数が1減少することを確認', async () => {
      // Arrange: 3つのルールを作成・保存
      const rules = [
        createTestRule({ id: 100 }),
        createTestRule({ id: 200 }),
        createTestRule({ id: 300 }),
      ];
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // 削除前の件数を確認
      const beforeCount = (await repository.getAll()).length;
      expect(beforeCount).toBe(3);

      // Act: 1つのルールを削除
      await deleteRuleInteractor.execute({ ruleId: 200 });

      // Assert: 削除後の件数が1減っていることを確認
      const afterCount = (await repository.getAll()).length;
      expect(afterCount).toBe(2);
      expect(afterCount).toBe(beforeCount - 1);

      // 残ったルールのIDが正しいことを確認
      const remainingRules = await repository.getAll();
      const remainingIds = remainingRules.map(r => r.id).sort();
      expect(remainingIds).toEqual([100, 300]);
    });

    it('複数削除時に件数が正確に減少することを確認', async () => {
      // Arrange: 10個のルールを作成・保存
      const rules = Array.from({ length: 10 }, (_, i) => 
        createTestRule({ id: i + 1, urlPattern: `https://site${i + 1}.com/*` })
      );
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // 初期件数確認
      let currentCount = (await repository.getAll()).length;
      expect(currentCount).toBe(10);

      // Act & Assert: 3つのルールを順次削除し、都度件数を確認
      await deleteRuleInteractor.execute({ ruleId: 3 });
      currentCount = (await repository.getAll()).length;
      expect(currentCount).toBe(9);

      await deleteRuleInteractor.execute({ ruleId: 7 });
      currentCount = (await repository.getAll()).length;
      expect(currentCount).toBe(8);

      await deleteRuleInteractor.execute({ ruleId: 10 });
      currentCount = (await repository.getAll()).length;
      expect(currentCount).toBe(7);

      // 残ったルールのIDが正しいことを確認
      const remainingRules = await repository.getAll();
      const remainingIds = remainingRules.map(r => r.id).sort();
      expect(remainingIds).toEqual([1, 2, 4, 5, 6, 8, 9]);
    });

    it('全ルール削除時にDB が空になることを確認', async () => {
      // Arrange: 3つのルールを作成・保存
      const rules = [
        createTestRule({ id: 1 }),
        createTestRule({ id: 2 }),
        createTestRule({ id: 3 }),
      ];
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // 初期状態で3件存在することを確認
      const initialCount = (await repository.getAll()).length;
      expect(initialCount).toBe(3);

      // Act: 全てのルールを削除
      await deleteRuleInteractor.execute({ ruleId: 1 });
      await deleteRuleInteractor.execute({ ruleId: 2 });
      await deleteRuleInteractor.execute({ ruleId: 3 });

      // Assert: DBが完全に空になることを確認
      const finalCount = (await repository.getAll()).length;
      expect(finalCount).toBe(0);

      const finalRules = await repository.getAll();
      expect(finalRules).toEqual([]);

      // 個別取得でも全てnullになることを確認
      expect(await repository.getById(1)).toBeNull();
      expect(await repository.getById(2)).toBeNull();
      expect(await repository.getById(3)).toBeNull();
    });
  });

  describe('プロパティの整合性', () => {
    it('削除操作が他ルールのプロパティを変更しないこと', async () => {
      // Arrange: 異なるプロパティ組み合わせのルールを作成
      const activeRule = createTestRule({ 
        id: 1, 
        urlPattern: 'https://active.com/*',
        isRegex: false,
        isActive: true
      });
      const inactiveRule = createTestRule({ 
        id: 2,
        urlPattern: 'https://inactive.com/*',
        isRegex: true,
        isActive: false
      });
      
      await repository.save(activeRule);
      await repository.save(inactiveRule);

      // 削除前の状態を記録
      const beforeActive = await repository.getById(1);
      const beforeInactive = await repository.getById(2);

      // Act: activeRule を削除
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: inactiveRule のプロパティが変更されていないことを確認
      const afterInactive = await repository.getById(2);
      
      expect(afterInactive).toBeDefined();
      expect(afterInactive!.id).toBe(beforeInactive!.id);
      expect(afterInactive!.urlPattern).toBe(beforeInactive!.urlPattern);
      expect(afterInactive!.oldString).toBe(beforeInactive!.oldString);
      expect(afterInactive!.newString).toBe(beforeInactive!.newString);
      expect(afterInactive!.isRegex).toBe(beforeInactive!.isRegex);
      expect(afterInactive!.isActive).toBe(beforeInactive!.isActive);

      // activeRule は削除されていることを確認
      const afterActive = await repository.getById(1);
      expect(afterActive).toBeNull();
    });
  });
});