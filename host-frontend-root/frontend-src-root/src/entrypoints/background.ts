import { registerRewriteRuleProxyService } from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyService';
import { contextMenusOnClicked } from 'src/infrastructure/browser/background/contextMenus/onClicked';
import { runtimeOnExtensionInstalled } from 'src/infrastructure/browser/background/runtime/onExtensionInstalled';
import { runtimeOnMessageReceived } from 'src/infrastructure/browser/background/runtime/onMessageReceived';
import { tabsOnUpdated } from 'src/infrastructure/browser/background/tabs/onUpdated';

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // proxy-serviceの登録
    // 注意: @webext-core/proxy-serviceは内部で@webext-core/messagingを使用しており、
    // chrome.runtime.onMessageリスナーを追加する。既存のメッセージハンドラーとの
    // 競合を避けるため、他のイベントリスナーよりも後に登録する。
    // ※ドキュメントでは「同期的に最初に」とあるが、WXTのmain()内でも動作する。

    // 各イベントリスナーを登録（Composition Root）
    tabsOnUpdated();
    runtimeOnExtensionInstalled();
    runtimeOnMessageReceived();
    contextMenusOnClicked();

    // proxy-serviceを最後に登録（既存のメッセージングとの競合を最小化）
    registerRewriteRuleProxyService();
  },
});
