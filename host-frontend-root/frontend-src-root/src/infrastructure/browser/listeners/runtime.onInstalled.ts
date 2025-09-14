import { container } from 'src/infrastructure/di/container';
import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';

export function registerRuntimeOnInstalled() {
  chrome.runtime.onInstalled.addListener(() => {
    const contextMenuSetupUseCase = container.resolve(ContextMenuSetupUseCase);
    contextMenuSetupUseCase.execute();
  });
}
