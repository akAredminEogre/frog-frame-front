import { beforeEach, describe, expect, it, vi } from 'vitest';
import 'fake-indexeddb/auto';

import { DeleteRuleInteractor } from 'src/application-business-rules/use-cases/delete-rule/DeleteRuleInteractor';
import { RewriteRuleRepository } from 'src/frameworks-and-drivers/db/RewriteRuleRepository';
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { createTestRule } from './helpers/createTestRule';

describe('Delete Rule - Presenter Output', () => {
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

  describe('成功通知テスト', () => {
    it('削除成功時にpresent()が正確に1回呼ばれること', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ 
        id: 1, 
        urlPattern: 'https://example.com/*'
      });
      await repository.save(testRule);

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: present()が1回だけ呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledTimes(1);
      expect(mockPresentError).not.toHaveBeenCalled();

      // 呼び出し引数が正確であることを確認
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 1 });
    });

    it('複数削除時にpresent()が削除回数分呼ばれること', async () => {
      // Arrange: 複数のテストルールを作成・保存
      const rules = [
        createTestRule({ id: 1 }),
        createTestRule({ id: 2 }),
        createTestRule({ id: 3 }),
      ];
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // Act: 3つのルールを順次削除
      await deleteRuleInteractor.execute({ ruleId: 1 });
      await deleteRuleInteractor.execute({ ruleId: 2 });
      await deleteRuleInteractor.execute({ ruleId: 3 });

      // Assert: present()が3回呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledTimes(3);
      expect(mockPresentError).not.toHaveBeenCalled();

      // 各削除で正しいIDが通知されることを確認
      expect(mockPresent).toHaveBeenNthCalledWith(1, { deletedRuleId: 1 });
      expect(mockPresent).toHaveBeenNthCalledWith(2, { deletedRuleId: 2 });
      expect(mockPresent).toHaveBeenNthCalledWith(3, { deletedRuleId: 3 });
    });

    it('大きなIDでも正しく通知されること', async () => {
      // Arrange: 大きなIDのルールを作成
      const largeIdRule = createTestRule({ 
        id: 999999,
        urlPattern: 'https://large-id.com/*'
      });
      await repository.save(largeIdRule);

      // Act: 削除実行
      await deleteRuleInteractor.execute({ ruleId: 999999 });

      // Assert: 大きなIDも正確に通知されることを確認
      expect(mockPresent).toHaveBeenCalledTimes(1);
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 999999 });
      expect(mockPresentError).not.toHaveBeenCalled();
    });
  });

  describe('削除ID通知テスト', () => {
    it('OutputDataに削除されたruleIdが正しく含まれること', async () => {
      // Arrange: 特定IDのルールを作成・保存
      const specificRule = createTestRule({ 
        id: 42,
        urlPattern: 'https://specific.com/*'
      });
      await repository.save(specificRule);

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 42 });

      // Assert: OutputData構造が正しいことを確認
      expect(mockPresent).toHaveBeenCalledTimes(1);
      
      const outputData = mockPresent.mock.calls[0][0];
      expect(outputData).toBeDefined();
      expect(outputData).toHaveProperty('deletedRuleId');
      expect(outputData.deletedRuleId).toBe(42);
      
      // 余計なプロパティがないことを確認
      expect(Object.keys(outputData)).toEqual(['deletedRuleId']);
    });

    it('異なるruleIdでそれぞれ正しく通知されること', async () => {
      // Arrange: 異なるIDのルールを作成・保存
      const rule1 = createTestRule({ id: 100 });
      const rule2 = createTestRule({ id: 200 });
      const rule3 = createTestRule({ id: 300 });
      
      await repository.save(rule1);
      await repository.save(rule2);
      await repository.save(rule3);

      // Act: 順不同で削除
      await deleteRuleInteractor.execute({ ruleId: 200 });
      await deleteRuleInteractor.execute({ ruleId: 100 });
      await deleteRuleInteractor.execute({ ruleId: 300 });

      // Assert: 削除順序に従って正しいIDが通知されることを確認
      expect(mockPresent).toHaveBeenCalledTimes(3);
      
      expect(mockPresent).toHaveBeenNthCalledWith(1, { deletedRuleId: 200 });
      expect(mockPresent).toHaveBeenNthCalledWith(2, { deletedRuleId: 100 });
      expect(mockPresent).toHaveBeenNthCalledWith(3, { deletedRuleId: 300 });
      
      // 各呼び出しでOutputDataの構造が正しいことを確認
      for (let i = 0; i < 3; i++) {
        const outputData = mockPresent.mock.calls[i][0];
        expect(outputData).toHaveProperty('deletedRuleId');
        expect(typeof outputData.deletedRuleId).toBe('number');
      }
    });

    it('presenter呼び出しのタイミングが削除完了後であることを確認', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ 
        id: 1,
        urlPattern: 'https://timing-test.com/*'
      });
      await repository.save(testRule);

      // present()が呼ばれる前にDBから削除されているかを検証するためのスパイ
      const originalPresent = mockPresent;
      mockPresent = vi.fn(async (outputData) => {
        // present()呼び出し時点でルールがDBから削除されていることを確認
        const deletedRule = await repository.getById(outputData.deletedRuleId);
        expect(deletedRule).toBeNull();
        
        // 元のmockPresent関数を呼び出し
        originalPresent(outputData);
      });

      // DeleteRuleInteractorを再作成（新しいpresent関数で）
      deleteRuleInteractor = new DeleteRuleInteractor(
        repository,
        mockTabsGateway,
        mockPresent,
        mockPresentError
      );

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: present()が呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledTimes(1);
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 1 });
    });
  });

  describe('コールバック引数の詳細検証', () => {
    it('OutputDataオブジェクトが正しい型であること', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ id: 123 });
      await repository.save(testRule);

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 123 });

      // Assert: 引数の詳細な型検証
      expect(mockPresent).toHaveBeenCalledTimes(1);
      
      const [outputData] = mockPresent.mock.calls[0];
      
      // outputDataがオブジェクトであることを確認
      expect(typeof outputData).toBe('object');
      expect(outputData).not.toBeNull();
      expect(Array.isArray(outputData)).toBe(false);
      
      // deletedRuleIdが数値であることを確認
      expect(typeof outputData.deletedRuleId).toBe('number');
      expect(Number.isInteger(outputData.deletedRuleId)).toBe(true);
      expect(outputData.deletedRuleId).toBe(123);
      
      // 不要なプロパティがないことを確認
      expect(Object.keys(outputData).length).toBe(1);
    });

    it('present()への引数が1つであることを確認', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ id: 456 });
      await repository.save(testRule);

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 456 });

      // Assert: present()が正確に1つの引数で呼ばれることを確認
      expect(mockPresent).toHaveBeenCalledTimes(1);
      
      const callArgs = mockPresent.mock.calls[0];
      expect(callArgs.length).toBe(1);
      
      const [outputData] = callArgs;
      expect(outputData).toEqual({ deletedRuleId: 456 });
    });

    it('presentError()は成功時に呼ばれないことを確認', async () => {
      // Arrange: 複数のテストルールを作成・保存
      const rules = [
        createTestRule({ id: 1 }),
        createTestRule({ id: 2 }),
        createTestRule({ id: 3 }),
      ];
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // Act: 複数のルールを削除
      await deleteRuleInteractor.execute({ ruleId: 1 });
      await deleteRuleInteractor.execute({ ruleId: 2 });
      await deleteRuleInteractor.execute({ ruleId: 3 });

      // Assert: 成功時はpresentError()が一切呼ばれないことを確認
      expect(mockPresent).toHaveBeenCalledTimes(3);
      expect(mockPresentError).toHaveBeenCalledTimes(0);
      expect(mockPresentError).not.toHaveBeenCalled();
    });
  });

  describe('非同期処理での通知タイミング', () => {
    it('awaitで削除完了を待ってから次の処理が実行されることを確認', async () => {
      // Arrange: 複数のルールを作成・保存
      const rule1 = createTestRule({ id: 1 });
      const rule2 = createTestRule({ id: 2 });
      
      await repository.save(rule1);
      await repository.save(rule2);

      // 実行順序を記録する配列
      const executionOrder: string[] = [];

      // present()をカスタマイズして実行順序を記録
      mockPresent = vi.fn((outputData) => {
        executionOrder.push(`present-${outputData.deletedRuleId}`);
      });

      // DeleteRuleInteractorを再作成
      deleteRuleInteractor = new DeleteRuleInteractor(
        repository,
        mockTabsGateway,
        mockPresent,
        mockPresentError
      );

      // Act: 順次削除実行
      await deleteRuleInteractor.execute({ ruleId: 1 });
      executionOrder.push('after-delete-1');
      
      await deleteRuleInteractor.execute({ ruleId: 2 });
      executionOrder.push('after-delete-2');

      // Assert: 正しい順序で実行されることを確認
      expect(executionOrder).toEqual([
        'present-1',
        'after-delete-1',
        'present-2', 
        'after-delete-2'
      ]);
      
      expect(mockPresent).toHaveBeenCalledTimes(2);
    });
  });
});