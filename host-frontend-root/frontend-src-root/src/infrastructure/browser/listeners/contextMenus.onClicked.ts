import { container } from 'src/infrastructure/di/container';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';

export function registerContextMenusOnClicked() {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'context-menu-replace-dom-element' && tab?.id != null) {
      const contextMenuUseCase = container.resolve(HandleContextMenuReplaceDomElement);
      await contextMenuUseCase.execute(tab.id);
    }
  });
}
