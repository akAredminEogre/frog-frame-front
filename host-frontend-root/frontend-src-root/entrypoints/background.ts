import { container } from 'src/infrastructure/di/container';
import { registerTabsOnUpdated } from 'src/infrastructure/browser/listeners/tabs.onUpdated';
import { registerStorageOnChanged } from 'src/infrastructure/browser/listeners/storage.onChanged';
import { registerRuntimeOnInstalled } from 'src/infrastructure/browser/listeners/runtime.onInstalled';
import { registerRuntimeOnMessage } from 'src/infrastructure/browser/listeners/runtime.onMessage';
import { registerContextMenusOnClicked } from 'src/infrastructure/browser/listeners/contextMenus.onClicked';

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // DI準備は container側で完了済み
    // 各イベントリスナーを登録（Composition Root）
    registerTabsOnUpdated();
    registerStorageOnChanged(container);
    registerRuntimeOnInstalled(container);
    registerRuntimeOnMessage();
    registerContextMenusOnClicked(container);
  },
});
