import 'reflect-metadata';
import { container } from 'tsyringe';

// Export the tsyringe container for use throughout the application
export { container };

// Register services with tsyringe
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleStorageChangedUseCase } from 'src/application/usecases/rule/HandleStorageChangedUseCase';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';

// Register implementations for interfaces (抽象化のため)
container.register<IChromeTabsService>('IChromeTabsService', { useClass: ChromeTabsService });

// Register concrete classes (@injectable デコレーターがあれば自動解決されるが、明示性のため記載)
container.register(HandleContextMenuReplaceDomElement, { useClass: HandleContextMenuReplaceDomElement });
container.register(ContextMenuSetupUseCase, { useClass: ContextMenuSetupUseCase });
container.register(HandleStorageChangedUseCase, { useClass: HandleStorageChangedUseCase });