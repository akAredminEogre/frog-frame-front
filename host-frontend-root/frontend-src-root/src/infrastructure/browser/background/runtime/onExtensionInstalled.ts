import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { container } from 'src/frameworks-and-drivers/di/container';

export function runtimeOnExtensionInstalled() {
  chrome.runtime.onInstalled.addListener(() => {
    const contextMenuSetupUseCase = container.resolve(ContextMenuSetupUseCase);
    contextMenuSetupUseCase.execute();
  });
}
