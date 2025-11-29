import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { container } from 'src/infrastructure/di/container';

export function runtimeOnExtensionInstalled() {
  chrome.runtime.onInstalled.addListener(() => {
    const contextMenuSetupUseCase = container.resolve<ContextMenuSetupUseCase>('contextMenuSetupUseCase');
    contextMenuSetupUseCase.execute();
  });
}
