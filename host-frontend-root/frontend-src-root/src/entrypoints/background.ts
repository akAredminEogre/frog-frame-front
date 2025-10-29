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
  },
});
