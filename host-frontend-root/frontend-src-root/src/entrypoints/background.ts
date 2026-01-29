import {
  registerRewriteRuleProxyService,
  setRewriteRuleProxyServiceImpl,
} from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyService';
import { createRewriteRuleProxyServiceImpl } from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyServiceImpl';
import { contextMenusOnClicked } from 'src/infrastructure/browser/background/contextMenus/onClicked';
import { runtimeOnExtensionInstalled } from 'src/infrastructure/browser/background/runtime/onExtensionInstalled';
import { runtimeOnMessageReceived } from 'src/frameworks-and-drivers/messaging/background/onMessageReceived';
import { tabsOnUpdated } from 'src/infrastructure/browser/background/tabs/onUpdated';

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
