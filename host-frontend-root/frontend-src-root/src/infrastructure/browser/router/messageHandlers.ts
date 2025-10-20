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
      console.log('[background] applyAllRules handler started', { 
        tabId: msg.tabId, 
        tabUrl: msg.tabUrl 
      });
      
      const { tabId, tabUrl } = msg;

      // Infrastructure層のサービスを使用してcontent scriptにメッセージを転送
      console.log('[background] Resolving ChromeTabsService from container');
      const chromeTabsService = container.resolve(ChromeTabsService);
      
      console.log('[background] Creating Tab value object', { tabId, tabUrl });
      const tab = new Tab(tabId, tabUrl);
      
      console.log('[background] Sending applyAllRules message to content script');
      const response = await chromeTabsService.sendApplyAllRulesMessage(tab);
      
      console.log('[background] Received response from content script', { response });
      return { success: true, response };

    } catch (error: any) {
      console.error('[background] applyAllRules error:', error);
      return { success: false, error: error.message };
    }
  },

  getAllRules: async () => {
    try {
      console.log('[background] getAllRules handler started');
      
      const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
      const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
      const rules = await getAllRulesUseCase.execute();
      
      console.log('[background] Retrieved rules from repository', { 
        rulesCount: rules.length 
      });
      
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
