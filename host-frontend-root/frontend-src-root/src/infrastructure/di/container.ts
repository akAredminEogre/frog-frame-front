import 'reflect-metadata';
import { container } from 'tsyringe';

// Export the tsyringe container for use throughout the application
export { container };

// Register services with tsyringe
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { SelectedPageTextService } from 'src/infrastructure/persistance/storage/SelectedPageTextService';
import { ChromePopupService } from 'src/infrastructure/browser/popup/ChromePopupService';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { ISelectedPageTextService } from 'src/application/ports/ISelectedPageTextService';
import { IPopupService } from 'src/application/ports/IPopupService';

// Register implementations for interfaces (抽象化のため)
container.register<IChromeTabsService>('IChromeTabsService', { useClass: ChromeTabsService });
container.register<ISelectedPageTextService>('ISelectedPageTextService', { useClass: SelectedPageTextService });
container.register<IPopupService>('IPopupService', { useClass: ChromePopupService });

// Register concrete classes (required for container.resolve() to work)
container.register(HandleContextMenuReplaceDomElement, { useClass: HandleContextMenuReplaceDomElement });
container.register(ContextMenuSetupUseCase, { useClass: ContextMenuSetupUseCase });