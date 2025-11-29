import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { container } from 'src/infrastructure/di/container';

export function contextMenusOnClicked() {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'context-menu-replace-dom-element' && tab?.id != null) {
      const contextMenuUseCase = container.resolve<HandleContextMenuReplaceDomElement>('handleContextMenuReplaceDomElement');
      await contextMenuUseCase.execute(tab.id);
    }
  });
}
