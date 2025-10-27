import { registerContextMenusOnClicked } from 'src/infrastructure/browser/listeners/contextMenus/background/onClicked';
import { registerRuntimeOnInstalled } from 'src/infrastructure/browser/listeners/runtime/background/onInstalled';
import { registerRuntimeOnMessage } from 'src/infrastructure/browser/listeners/runtime/background/onMessage';
import { registerTabsOnUpdated } from 'src/infrastructure/browser/listeners/tabs/background/onUpdated';

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // DI準備は container側で完了済み
    // 各イベントリスナーを登録（Composition Root）
    registerTabsOnUpdated();
    registerRuntimeOnInstalled();
    registerRuntimeOnMessage();
    registerContextMenusOnClicked();
  },
});
