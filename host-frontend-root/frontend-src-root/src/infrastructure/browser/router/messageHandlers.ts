import type { SimpleContainer } from 'src/infrastructure/di/container';
import { ApplyRewriteRuleToTabUseCase } from 'src/application/usecases/rule/ApplyRewriteRuleToTabUseCase';

type Message =
  | { type: 'applyRewriteRule'; targetTabId?: number; rule: any }
  | { type: 'ping' };

export const handlers = (container: SimpleContainer) => ({
  applyRewriteRule: async (msg: Extract<Message, { type: 'applyRewriteRule' }>) => {
    if (msg.targetTabId) {
      const applyRewriteRuleUseCase = container.resolve(ApplyRewriteRuleToTabUseCase);
      
      try {
        const result = await applyRewriteRuleUseCase.execute(msg.targetTabId, msg.rule);
        return result;
      } catch (error: any) {
        console.error('[background] ApplyRewriteRuleToTabUseCase error:', error);
        return { success: false, error: error.message };
      }
    } else {
      // 特定のタブIDが指定されていない場合は、ストレージの変更をトリガーとしてinjectContentScriptsBasedOnRulesが呼ばれるので、
      // ここでは単に成功を返す
      return { success: true };
    }
  },
  ping: async () => ({ pong: true }),
});
