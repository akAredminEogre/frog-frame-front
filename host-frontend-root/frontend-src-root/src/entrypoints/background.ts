import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { container } from 'src/frameworks-and-drivers/di/container';
import {
  IRewriteRuleProxyService,
  registerRewriteRuleProxyService,
  setRewriteRuleProxyServiceImpl,
} from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyService';
import { contextMenusOnClicked } from 'src/infrastructure/browser/background/contextMenus/onClicked';
import { runtimeOnExtensionInstalled } from 'src/infrastructure/browser/background/runtime/onExtensionInstalled';
import { runtimeOnMessageReceived } from 'src/infrastructure/browser/background/runtime/onMessageReceived';
import { tabsOnUpdated } from 'src/infrastructure/browser/background/tabs/onUpdated';

/**
 * RewriteRuleProxyService の実装を作成
 * container を使用してリポジトリを解決し、ルールを取得する
 */
function createRewriteRuleProxyServiceImpl(): IRewriteRuleProxyService {
  return {
    async getAllRules() {
      const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
      const rules = await repository.getAll();

      return rules.toArray().map((rule) => ({
        id: rule.id,
        oldString: rule.oldString,
        newString: rule.newString,
        urlPattern: rule.urlPattern,
        isRegex: rule.isRegex,
        isActive: rule.isActive,
      }));
    },
  };
}

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // DI準備は container側で完了済み
    // Proxy Service実装を注入して登録（Content Script → Background通信用）
    setRewriteRuleProxyServiceImpl(createRewriteRuleProxyServiceImpl());
    registerRewriteRuleProxyService();

    // 各イベントリスナーを登録（Composition Root）
    tabsOnUpdated();
    runtimeOnExtensionInstalled();
    runtimeOnMessageReceived();
    contextMenusOnClicked();
  },
});
