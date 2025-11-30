import { contextMenusOnClicked } from 'src/infrastructure/browser/background/contextMenus/onClicked';
import { runtimeOnExtensionInstalled } from 'src/infrastructure/browser/background/runtime/onExtensionInstalled';
import { runtimeOnMessageReceived } from 'src/infrastructure/browser/background/runtime/onMessageReceived';
import { tabsOnUpdated } from 'src/infrastructure/browser/background/tabs/onUpdated';

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    console.log('[DEBUG] background.ts main: START');
    // DI準備は container側で完了済み
    // 各イベントリスナーを登録（Composition Root）
    tabsOnUpdated();
    console.log('[DEBUG] background.ts main: tabsOnUpdated registered');
    runtimeOnExtensionInstalled();
    console.log('[DEBUG] background.ts main: runtimeOnExtensionInstalled registered');
    runtimeOnMessageReceived();
    console.log('[DEBUG] background.ts main: runtimeOnMessageReceived registered');
    contextMenusOnClicked();
    console.log('[DEBUG] background.ts main: END');
  },
});
