import { registerRewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';
import { contextMenusOnClicked } from 'src/infrastructure/browser/background/contextMenus/onClicked';
import { registerBackgroundMessageHandlers } from 'src/infrastructure/browser/background/runtime/registerBackgroundMessageHandlers';
import { runtimeOnExtensionInstalled } from 'src/infrastructure/browser/background/runtime/onExtensionInstalled';
import { tabsOnUpdated } from 'src/infrastructure/browser/background/tabs/onUpdated';

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // DI準備は container側で完了済み

    // @webext-core/messagingを使用したメッセージハンドラーを登録（ADR-002準拠）
    // proxy-serviceの登録（RewriteRuleMessagingService用）
    registerRewriteRuleMessagingService();
    // Background Script用メッセージハンドラー（getAllRules, applyAllRules）
    registerBackgroundMessageHandlers();

    // 各イベントリスナーを登録（Composition Root）
    tabsOnUpdated();
    runtimeOnExtensionInstalled();
    contextMenusOnClicked();
  },
});
