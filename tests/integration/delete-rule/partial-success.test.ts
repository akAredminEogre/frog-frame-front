import { beforeEach, describe, expect, it, vi } from 'vitest';
import 'fake-indexeddb/auto';

import { DeleteRuleInteractor } from 'src/application-business-rules/use-cases/delete-rule/DeleteRuleInteractor';
import { RewriteRuleRepository } from 'src/frameworks-and-drivers/db/RewriteRuleRepository';
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { createTestRule } from './helpers/createTestRule';

describe('Delete Rule - Partial Success', () => {
  let deleteRuleInteractor: DeleteRuleInteractor;
  let repository: RewriteRuleRepository;
  let mockTabsGateway: ReturnType<typeof createMockTabsGateway>;
  let mockPresent: ReturnType<typeof vi.fn>;
  let mockPresentError: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Repository初期化（fake-indexeddbを使用）
    repository = new RewriteRuleRepository();
    await repository.initialize();

    // TabsGateway モック作成（この時点では成功設定、後でテスト内で設定変更）
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

  describe('削除成功 + リロード失敗', () => {
    it('ルールは削除され、presentError()でリロード失敗を通知すること', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ 
        id: 1, 
        urlPattern: 'https://example.com/*'
      });
      await repository.save(testRule);

      // TabsGatewayがリロード失敗するように設定
      mockTabsGateway.reloadMatchingTabs.mockRejectedValue(
        new Error('Failed to reload tabs: No permission')
      );

      // 削除前にルールが存在することを確認
      const beforeDelete = await repository.getById(1);
      expect(beforeDelete).toBeDefined();

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: ルールは削除されているが、エラーが通知されることを確認
      const afterDelete = await repository.getById(1);
      expect(afterDelete).toBeNull(); // ルールは削除されている

      // presentError()が呼ばれ、present()は呼ばれないことを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      // TabsGatewayが呼ばれたことを確認
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(1);
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledWith('https://example.com/*');

      // エラーメッセージにリロード失敗が含まれることを確認
      const errorMessage = mockPresentError.mock.calls[0][0];
      expect(errorMessage).toContain('reload');
      expect(errorMessage).toContain('No permission');
    });

    it('複数ルール削除で一部のタブリロードが失敗した場合の動作確認', async () => {
      // Arrange: 複数のテストルールを作成・保存
      const rules = [
        createTestRule({ id: 1, urlPattern: 'https://success.com/*' }),
        createTestRule({ id: 2, urlPattern: 'https://failure.com/*' }),
        createTestRule({ id: 3, urlPattern: 'https://success2.com/*' }),
      ];
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // TabsGatewayが特定のURLパターンでのみ失敗するように設定
      mockTabsGateway.reloadMatchingTabs
        .mockImplementation((urlPattern: string) => {
          if (urlPattern === 'https://failure.com/*') {
            return Promise.reject(new Error('Tab reload failed'));
          }
          return Promise.resolve();
        });

      // Act: 3つのルールを順次削除
      await deleteRuleInteractor.execute({ ruleId: 1 }); // 成功
      await deleteRuleInteractor.execute({ ruleId: 2 }); // タブリロード失敗
      await deleteRuleInteractor.execute({ ruleId: 3 }); // 成功

      // Assert: 全てのルールが削除されていることを確認
      expect(await repository.getById(1)).toBeNull();
      expect(await repository.getById(2)).toBeNull();
      expect(await repository.getById(3)).toBeNull();

      const remainingRules = await repository.getAll();
      expect(remainingRules).toHaveLength(0);

      // Presenterの呼び出し状況を確認
      expect(mockPresent).toHaveBeenCalledTimes(2); // ID 1, 3 の成功
      expect(mockPresentError).toHaveBeenCalledTimes(1); // ID 2 の失敗

      // 成功した削除の通知を確認
      expect(mockPresent).toHaveBeenNthCalledWith(1, { deletedRuleId: 1 });
      expect(mockPresent).toHaveBeenNthCalledWith(2, { deletedRuleId: 3 });

      // タブリロード失敗のエラーメッセージを確認
      const errorMessage = mockPresentError.mock.calls[0][0];
      expect(errorMessage).toContain('Tab reload failed');

      // TabsGatewayが3回呼ばれたことを確認
      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(3);
    });

    it('ネットワーク系タブリロードエラーでも削除は完了すること', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ 
        id: 1, 
        urlPattern: 'https://network-issue.com/*'
      });
      await repository.save(testRule);

      // TabsGatewayがネットワーク系エラーで失敗するように設定
      mockTabsGateway.reloadMatchingTabs.mockRejectedValue(
        new Error('Network error: Connection timeout')
      );

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: ルールは削除され、エラーが適切に通知されることを確認
      const afterDelete = await repository.getById(1);
      expect(afterDelete).toBeNull();

      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      const errorMessage = mockPresentError.mock.calls[0][0];
      expect(errorMessage).toContain('Network error');
      expect(errorMessage).toContain('Connection timeout');
    });

    it('Chrome拡張権限不足エラーでも削除は完了すること', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ 
        id: 1, 
        urlPattern: 'https://permission-denied.com/*'
      });
      await repository.save(testRule);

      // TabsGatewayがChrome拡張権限エラーで失敗するように設定
      mockTabsGateway.reloadMatchingTabs.mockRejectedValue(
        new Error('Chrome extension error: Permission denied for tabs API')
      );

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 1 });

      // Assert: ルールは削除され、権限エラーが適切に通知されることを確認
      const afterDelete = await repository.getById(1);
      expect(afterDelete).toBeNull();

      expect(mockPresentError).toHaveBeenCalledTimes(1);
      expect(mockPresent).not.toHaveBeenCalled();

      const errorMessage = mockPresentError.mock.calls[0][0];
      expect(errorMessage).toContain('Permission denied');
      expect(errorMessage).toContain('tabs API');
    });
  });

  describe('エラーメッセージの内容確認', () => {
    it('リロード失敗エラーメッセージが分かりやすい内容であること', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ 
        id: 42, 
        urlPattern: 'https://test.com/*'
      });
      await repository.save(testRule);

      // TabsGatewayが失敗するように設定
      const originalError = new Error('Specific reload failure');
      mockTabsGateway.reloadMatchingTabs.mockRejectedValue(originalError);

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 42 });

      // Assert: エラーメッセージが適切な内容であることを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
      
      const errorMessage = mockPresentError.mock.calls[0][0];
      expect(typeof errorMessage).toBe('string');
      expect(errorMessage.length).toBeGreaterThan(0);
      
      // エラーメッセージに含まれるべき情報を確認
      expect(errorMessage).toContain('42'); // 削除されたルールID
      expect(errorMessage).toContain('Specific reload failure'); // 元のエラー情報
      
      // ユーザーフレンドリーな内容であることを確認
      const lowerErrorMessage = errorMessage.toLowerCase();
      expect(lowerErrorMessage).toMatch(/delete|削除|success|成功/);
      expect(lowerErrorMessage).toMatch(/reload|tab|リロード|タブ/);
    });

    it('部分成功状況が明確に伝わるエラーメッセージであること', async () => {
      // Arrange: テストルールを作成・保存
      const testRule = createTestRule({ 
        id: 100, 
        urlPattern: 'https://partial-success.com/*'
      });
      await repository.save(testRule);

      mockTabsGateway.reloadMatchingTabs.mockRejectedValue(
        new Error('Background script not responding')
      );

      // Act: ルール削除実行
      await deleteRuleInteractor.execute({ ruleId: 100 });

      // Assert: 部分成功の状況が分かるエラーメッセージであることを確認
      const errorMessage = mockPresentError.mock.calls[0][0];
      
      // ルールの削除自体は成功したことが伝わる内容であることを確認
      const lowerErrorMessage = errorMessage.toLowerCase();
      expect(
        lowerErrorMessage.includes('deleted') || 
        lowerErrorMessage.includes('removed') ||
        lowerErrorMessage.includes('削除') ||
        lowerErrorMessage.includes('成功')
      ).toBe(true);
      
      // タブリロードに問題があったことが伝わる内容であることを確認
      expect(
        lowerErrorMessage.includes('tab') || 
        lowerErrorMessage.includes('reload') ||
        lowerErrorMessage.includes('タブ') ||
        lowerErrorMessage.includes('リロード')
      ).toBe(true);
      
      // 元のエラー情報も含まれていることを確認
      expect(errorMessage).toContain('Background script not responding');
    });
  });

  describe('データベース状態の整合性', () => {
    it('タブリロード失敗でもDBからルールが正確に削除されていること', async () => {
      // Arrange: 複数のテストルールを作成・保存
      const rules = [
        createTestRule({ id: 1, urlPattern: 'https://keep1.com/*' }),
        createTestRule({ id: 2, urlPattern: 'https://delete-fail.com/*' }),
        createTestRule({ id: 3, urlPattern: 'https://keep2.com/*' }),
      ];
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // rule2のタブリロードのみ失敗するように設定
      mockTabsGateway.reloadMatchingTabs
        .mockImplementation((urlPattern: string) => {
          if (urlPattern === 'https://delete-fail.com/*') {
            return Promise.reject(new Error('Tab reload failed'));
          }
          return Promise.resolve();
        });

      // 削除前に3件存在することを確認
      const beforeDelete = await repository.getAll();
      expect(beforeDelete).toHaveLength(3);

      // Act: rule2を削除（タブリロードは失敗）
      await deleteRuleInteractor.execute({ ruleId: 2 });

      // Assert: DB状態の整合性を詳細確認
      const afterDelete = await repository.getAll();
      expect(afterDelete).toHaveLength(2); // 1件減っている

      const afterDeleteIds = afterDelete.map(r => r.id).sort();
      expect(afterDeleteIds).toEqual([1, 3]); // rule2のみ削除されている

      // 削除されたルールは取得できないことを確認
      const deletedRule = await repository.getById(2);
      expect(deletedRule).toBeNull();

      // 残ったルールは正常に取得できることを確認
      const remainingRule1 = await repository.getById(1);
      const remainingRule3 = await repository.getById(3);
      expect(remainingRule1).toBeDefined();
      expect(remainingRule3).toBeDefined();
      expect(remainingRule1!.urlPattern).toBe('https://keep1.com/*');
      expect(remainingRule3!.urlPattern).toBe('https://keep2.com/*');

      // presentError()が呼ばれたことを確認
      expect(mockPresentError).toHaveBeenCalledTimes(1);
    });

    it('連続する部分成功操作でもDBの整合性が保たれること', async () => {
      // Arrange: 5つのルールを作成（奇数IDでタブリロード失敗）
      const rules = [
        createTestRule({ id: 1 }),
        createTestRule({ id: 2 }),
        createTestRule({ id: 3 }),
        createTestRule({ id: 4 }),
        createTestRule({ id: 5 }),
      ];
      
      for (const rule of rules) {
        await repository.save(rule);
      }

      // 奇数IDでタブリロード失敗するように設定
      mockTabsGateway.reloadMatchingTabs
        .mockImplementation((urlPattern: string) => {
          // createTestRuleはURLパターンに'https://example.com'を使用
          const oddRulePatterns = ['https://example.com']; // デフォルトパターン
          return Promise.reject(new Error('Odd ID tab reload failed'));
        });

      // 実際の設定：IDが奇数かどうかで判定するためにモックを調整
      let callCount = 0;
      mockTabsGateway.reloadMatchingTabs
        .mockImplementation(() => {
          callCount++;
          if (callCount % 2 === 1) { // 1回目、3回目、5回目の呼び出しで失敗（奇数ID想定）
            return Promise.reject(new Error(`Tab reload failed for call ${callCount}`));
          }
          return Promise.resolve();
        });

      // 初期状態を確認
      const initial = await repository.getAll();
      expect(initial).toHaveLength(5);

      // Act: 全てのルールを順次削除
      await deleteRuleInteractor.execute({ ruleId: 1 }); // 失敗
      await deleteRuleInteractor.execute({ ruleId: 2 }); // 成功  
      await deleteRuleInteractor.execute({ ruleId: 3 }); // 失敗
      await deleteRuleInteractor.execute({ ruleId: 4 }); // 成功
      await deleteRuleInteractor.execute({ ruleId: 5 }); // 失敗

      // Assert: 全てのルールが削除されていることを確認（タブリロード失敗に関わらず）
      const final = await repository.getAll();
      expect(final).toHaveLength(0);

      // 個別確認
      for (let id = 1; id <= 5; id++) {
        const deletedRule = await repository.getById(id);
        expect(deletedRule).toBeNull();
      }

      // Presenterの呼び出し状況を確認
      expect(mockPresent).toHaveBeenCalledTimes(2); // ID 2, 4 の成功
      expect(mockPresentError).toHaveBeenCalledTimes(3); // ID 1, 3, 5 のタブリロード失敗

      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(5);
    });
  });
});