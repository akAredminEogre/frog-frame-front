import { contextMenusOnClicked } from 'src/infrastructure/browser/background/contextMenus/onClicked';
import { runtimeOnExtensionInstalled } from 'src/infrastructure/browser/background/runtime/onExtensionInstalled';
import { registerBackgroundMessageHandlers } from 'src/infrastructure/browser/background/runtime/registerBackgroundMessageHandlers';
import { tabsOnUpdated } from 'src/infrastructure/browser/background/tabs/onUpdated';

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // DI準備は container側で完了済み

    // @webext-core/messagingを使用したメッセージハンドラーを登録（ADR-002準拠）
    // Background Script用メッセージハンドラー（getAllRules, applyAllRules）
    registerBackgroundMessageHandlers();

    // TODO: registerRewriteRuleMessagingService()は別PRで対応予定
    // @webext-core/proxy-serviceの統合は、追加の調査が必要なため保留

    // 各イベントリスナーを登録（Composition Root）
    tabsOnUpdated();
    runtimeOnExtensionInstalled();
    contextMenusOnClicked();
  },
});
