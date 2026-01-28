import { beforeEach, describe, expect, it, vi } from 'vitest';
import 'fake-indexeddb/auto';

import { DeleteRuleInteractor } from 'src/application-business-rules/use-cases/delete-rule/DeleteRuleInteractor';
import { RewriteRuleRepository } from 'src/frameworks-and-drivers/db/RewriteRuleRepository';
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { createTestRule } from './helpers/createTestRule';

describe('Delete Rule - Error Cases', () => {
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

  describe('存在しないIDエラー', () => {
    it('存在しないruleIdでpresentError()が呼ばれること', async () => {
      // Arrange: 存在しないIDを指定（DBは空の状態）
      const nonExistentId = 999;
      
      // DBが空であることを確認
      const allRules = await repository.getAll();
      expect(allRules).toHaveLength(0);

      // Act: 存在しないIDで削除を試行
      await deleteRuleInteractor.execute({ ruleId: nonExistentId });

      // Assert: presentError()が呼ばれ、present()は呼ばれないことを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      // エラーメッセージが適切であることを確認
      const errorArg = mockPresentError.mock.calls[0][0];
      expect(errorArg).toBeDefined();
      expect(typeof errorArg).toBe('string');
      expect(errorArg).toContain('999');
      expect(errorArg.toLowerCase()).toContain('not found');

      // TabsGatewayは呼ばれないことを確認
      expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();
    });

    it('一部ルールがある状態で存在しないIDを指定してもエラーになること', async () => {
      // Arrange: いくつかのルールを保存
      const existingRules = [
        createTestRule({ id: 1 }),
        createTestRule({ id: 3 }),
        createTestRule({ id: 5 }),
      ];
      
      for (const rule of existingRules) {
        await repository.save(rule);
      }

      // Act: 存在しないID（2, 4, 6）で削除を試行
      await deleteRuleInteractor.execute({ ruleId: 2 });
      await deleteRuleInteractor.execute({ ruleId: 4 });
      await deleteRuleInteractor.execute({ ruleId: 6 });

      // Assert: 3回ともエラーになることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(3);
      expect(mockPresent).not.toHaveBeenCalled();

      // 既存のルールは変更されていないことを確認
      const afterRules = await repository.getAll();
      expect(afterRules).toHaveLength(3);
      const afterIds = afterRules.map(r => r.id).sort();
      expect(afterIds).toEqual([1, 3, 5]);

      // TabsGatewayは一切呼ばれないことを確認
      expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();
    });

    it('削除後に同じIDで再削除を試行するとエラーになること', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ id: 10 });
      await repository.save(testRule);

      // Act: 1回目の削除（成功）
      await deleteRuleInteractor.execute({ ruleId: 10 });

      // モックをリセットして2回目の状態を確認
      vi.clearAllMocks();

      // Act: 2回目の削除（同じID、エラーになるべき）
      await deleteRuleInteractor.execute({ ruleId: 10 });

      // Assert: 2回目はエラーになることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      // エラーメッセージに削除済みIDが含まれることを確認
      const errorArg = mockPresentError.mock.calls[0][0];
      expect(errorArg).toContain('10');
    });

    it('負のIDや0でエラーになること', async () => {
      // Act & Assert: 負のID
      await deleteRuleInteractor.execute({ ruleId: -1 });
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      vi.clearAllMocks();

      // Act & Assert: 0
      await deleteRuleInteractor.execute({ ruleId: 0 });
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      // TabsGatewayは呼ばれないことを確認
      expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();
    });
  });

  describe('Repository例外エラー', () => {
    it('Repository.getById()が例外発生時にpresentError()が呼ばれること', async () => {
      // Arrange: Repository.getByIdにスパイを設定して例外を発生させる
      const getByIdSpy = vi.spyOn(repository, 'getById')
        .mockRejectedValue(new Error('Database connection failed'));

      // Act: 削除を試行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: presentError()が呼ばれることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      // getByIdが呼ばれたことを確認
      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(1);

      // エラーメッセージが適切であることを確認
      const errorArg = mockPresentError.mock.calls[0][0];
      expect(errorArg).toContain('Database connection failed');

      // TabsGatewayは呼ばれないことを確認
      expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();

      // スパイをリストア
      getByIdSpy.mockRestore();
    });

    it('Repository.delete()が例外発生時にpresentError()が呼ばれること', async () => {
      // Arrange: 有効なルールを作成・保存
      const testRule = createTestRule({ id: 1 });
      await repository.save(testRule);

      // Repository.deleteにスパイを設定して例外を発生させる
      const deleteSpy = vi.spyOn(repository, 'delete')
        .mockRejectedValue(new Error('Delete operation failed'));

      // Act: 削除を試行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: presentError()が呼ばれることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      // deleteが呼ばれたことを確認
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(1);

      // エラーメッセージが適切であることを確認
      const errorArg = mockPresentError.mock.calls[0][0];
      expect(errorArg).toContain('Delete operation failed');

      // TabsGatewayは呼ばれないことを確認（削除が失敗したため）
      expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();

      // ルールは削除されていないことを確認（トランザクション的動作）
      deleteSpy.mockRestore();
      const remainingRule = await repository.getById(1);
      expect(remainingRule).toBeDefined();
      expect(remainingRule!.id).toBe(1);
    });

    it('Repository初期化エラーの場合もpresentError()が呼ばれること', async () => {
      // Arrange: Repository.initializeにスパイを設定（既に初期化済みなので、直接deleteに例外を設定）
      const deleteSpy = vi.spyOn(repository, 'delete')
        .mockRejectedValue(new Error('Repository not initialized'));

      // 有効なルールを作成・保存
      const testRule = createTestRule({ id: 1 });
      await repository.save(testRule);

      // Act: 削除を試行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: presentError()が呼ばれることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      const errorArg = mockPresentError.mock.calls[0][0];
      expect(errorArg).toContain('Repository not initialized');

      deleteSpy.mockRestore();
    });

    it('Repository例外時にTabsGatewayが呼ばれないこと', async () => {
      // Arrange: 有効なルールを作成・保存
      const testRule = createTestRule({ 
        id: 1,
        urlPattern: 'https://example.com/*'
      });
      await repository.save(testRule);

      // Repository.getByIdが成功し、Repository.deleteが失敗するケース
      const deleteSpy = vi.spyOn(repository, 'delete')
        .mockRejectedValue(new Error('Critical DB error'));

      // Act: 削除を試行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: Repository例外時はTabsGatewayが呼ばれないことを確認
      expect(mockTabsGateway.reloadMatchingTabs).not.toHaveBeenCalled();
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      deleteSpy.mockRestore();
    });
  });

  describe('不正なInputData', () => {
    it('ruleIdがnullの場合にpresentError()が呼ばれること', async () => {
      // Act: nullのruleIdで削除を試行
      await deleteRuleInteractor.execute({ ruleId: null as any });

      // Assert: presentError()が呼ばれることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      const errorArg = mockPresentError.mock.calls[0][0];
      expect(errorArg).toBeDefined();
      expect(typeof errorArg).toBe('string');
    });

    it('ruleIdがundefinedの場合にpresentError()が呼ばれること', async () => {
      // Act: undefinedのruleIdで削除を試行
      await deleteRuleInteractor.execute({ ruleId: undefined as any });

      // Assert: presentError()が呼ばれることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      const errorArg = mockPresentError.mock.calls[0][0];
      expect(errorArg).toBeDefined();
      expect(typeof errorArg).toBe('string');
    });

    it('ruleIdが文字列の場合にpresentError()が呼ばれること', async () => {
      // Act: 文字列のruleIdで削除を試行
      await deleteRuleInteractor.execute({ ruleId: "123" as any });

      // Assert: presentError()が呼ばれることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();
    });
  });

  describe('エラーハンドリングの詳細', () => {
    it('presentError()の引数が文字列であることを確認', async () => {
      // Arrange: 存在しないIDを指定
      const nonExistentId = 999;

      // Act: 削除を試行
      await deleteRuleInteractor.execute({ ruleId: nonExistentId });

      // Assert: presentError()の引数が文字列であることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      
      const [errorMessage] = mockPresentError.mock.calls[0];
      expect(typeof errorMessage).toBe('string');
      expect(errorMessage.length).toBeGreaterThan(0);
      expect(errorMessage).not.toBe('');
    });

    it('複数のエラーが発生しても各回presentError()が呼ばれること', async () => {
      // Act: 複数の不正なIDで削除を試行
      await deleteRuleInteractor.execute({ ruleId: -1 });
      await deleteRuleInteractor.execute({ ruleId: 999 });
      await deleteRuleInteractor.execute({ ruleId: null as any });

      // Assert: 3回ともpresentError()が呼ばれることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(3);
      expect(mockPresent).not.toHaveBeenCalled();

      // 各エラーメッセージが文字列であることを確認
      for (let i = 0; i < 3; i++) {
        const errorMessage = mockPresentError.mock.calls[i][0];
        expect(typeof errorMessage).toBe('string');
        expect(errorMessage.length).toBeGreaterThan(0);
      }
    });

    it('エラー後の状態でも正常な削除が可能であること', async () => {
      // Arrange: 有効なルールを作成・保存
      const validRule = createTestRule({ id: 1 });
      await repository.save(validRule);

      // Act: まずエラーケースを実行
      await deleteRuleInteractor.execute({ ruleId: 999 });
      
      // モックをクリア
      vi.clearAllMocks();
      
      // 正常な削除を実行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: 正常な削除が成功することを確認
      expect(mockPresent).toHaveBeenCalledTimes(1);
      expect(mockPresentError).not.toHaveBeenCalled();
      expect(mockPresent).toHaveBeenCalledWith({ deletedRuleId: 1 });

      // ルールが実際に削除されていることを確認
      const deletedRule = await repository.getById(1);
      expect(deletedRule).toBeNull();
    });
  });
});