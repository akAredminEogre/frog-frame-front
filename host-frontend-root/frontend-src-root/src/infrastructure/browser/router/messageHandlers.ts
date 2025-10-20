import { container } from 'src/infrastructure/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { Tab } from 'src/domain/value-objects/Tab';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { GetAllRewriteRulesUseCase } from 'src/application/usecases/rule/GetAllRewriteRulesUseCase';

type Message =
  | { type: 'applyAllRules'; tabId: number; tabUrl: string }
  | { type: 'getAllRules' }
  | { type: 'ping' };

/**
 * Message handlers using tsyringe DI container
 * sendMessageの受信側であるcontent scriptにメッセージを転送する
 */
export const handlers = {
  applyAllRules: async (msg: Extract<Message, { type: 'applyAllRules' }>) => {
    try {
      const { tabId, tabUrl } = msg;

      // Infrastructure層のサービスを使用してcontent scriptにメッセージを転送
      const chromeTabsService = container.resolve(ChromeTabsService);
      const tab = new Tab(tabId, tabUrl);
      const response = await chromeTabsService.sendApplyAllRulesMessage(tab);
      
      return { success: true, response };

    } catch (error: any) {
      console.error('[background] applyAllRules error:', error);
      return { success: false, error: error.message };
    }
  },

  getAllRules: async () => {
    try {
      const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
      const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
      const rules = await getAllRulesUseCase.execute();
      
      return { 
        success: true, 
        rules: rules.map(rule => ({
          id: rule.id,
          oldString: rule.oldString,
          newString: rule.newString,
          urlPattern: rule.urlPattern,
          isRegex: rule.isRegex
        }))
      };
    } catch (error: any) {
      console.error('[background] getAllRules error:', error);
      return { success: false, error: error.message };
    }
  },

  ping: async () => ({ pong: true }),
};
