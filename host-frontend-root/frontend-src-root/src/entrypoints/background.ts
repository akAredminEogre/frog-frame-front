// TODO: 既存メッセージングを@webext-core/messagingに移行後、以下のimportを有効化
// import { registerRewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';
import { contextMenusOnClicked } from 'src/infrastructure/browser/background/contextMenus/onClicked';
import { runtimeOnExtensionInstalled } from 'src/infrastructure/browser/background/runtime/onExtensionInstalled';
import { runtimeOnMessageReceived } from 'src/infrastructure/browser/background/runtime/onMessageReceived';
import { tabsOnUpdated } from 'src/infrastructure/browser/background/tabs/onUpdated';

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // DI準備は container側で完了済み
    // 各イベントリスナーを登録（Composition Root）
    tabsOnUpdated();
    runtimeOnExtensionInstalled();
    runtimeOnMessageReceived();
    contextMenusOnClicked();

    // TODO: 既存メッセージングを@webext-core/messagingに移行後、以下を有効化
    // 現在は既存のchrome.runtime.sendMessage（timestampなし）と@webext-core/messaging
    // （timestampフィールド必須）が競合するため、一時的に無効化
    // 詳細: @webext-core/messagingはtimestampのないメッセージに対してエラーをスローし、
    // これが既存のメッセージングに影響を与える
    // registerRewriteRuleMessagingService();
  },
});
