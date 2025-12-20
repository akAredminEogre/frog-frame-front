import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';
import { Tab } from 'src/domain/value-objects/Tab';
import { container } from 'src/frameworks-and-drivers/di/container';
import { backgroundMessaging } from 'src/frameworks-and-drivers/messaging/backgroundMessaging';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';

/**
 * Background Script用メッセージハンドラーを登録
 * @webext-core/messagingを使用した新しいメッセージングパターン
 *
 * 呼び出し元: entrypoints/background.ts
 */
export function registerBackgroundMessageHandlers() {
  const { onMessage } = backgroundMessaging;

  // getAllRulesハンドラー
  onMessage('getAllRules', async () => {
    try {
      const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
      const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
      const rules = await getAllRulesUseCase.execute();

      return {
        success: true,
        rules: rules,
      };
    } catch (error: any) {
      console.error('[background] getAllRules error:', error);
      return { success: false, error: error.message };
    }
  });

  // applyAllRulesハンドラー
  onMessage('applyAllRules', async ({ data }) => {
    try {
      const { tabId, tabUrl } = data;

      // Infrastructure層のサービスを使用してcontent scriptにメッセージを転送
      const chromeTabsService = container.resolve(ChromeTabsService);
      const tab = new Tab(tabId, tabUrl);
      const response = await chromeTabsService.sendApplyAllRulesMessage(tab);

      return { success: true, response };
    } catch (error: any) {
      console.error('[background] applyAllRules error:', error);
      return { success: false, error: error.message };
    }
  });
}
