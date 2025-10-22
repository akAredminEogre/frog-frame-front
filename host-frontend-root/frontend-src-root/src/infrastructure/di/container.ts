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
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { IWindowService } from 'src/application/ports/IWindowService';
import { ChromeWindowService } from 'src/infrastructure/browser/window/ChromeWindowService';
import { CloseCurrentWindowUseCase } from 'src/application/usecases/window/CloseCurrentWindowUseCase';
import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';
import { SelectedPageTextRepository } from 'src/infrastructure/storage/SelectedPageTextRepository';
import { GetSelectedPageTextUseCase } from 'src/application/usecases/selectedPageText/GetSelectedPageTextUseCase';

// Register implementations for interfaces (抽象化のため)
container.register<IChromeTabsService>('IChromeTabsService', { useClass: ChromeTabsService });
container.register<ISelectedPageTextService>('ISelectedPageTextService', { useClass: SelectedPageTextService });
container.register<IPopupService>('IPopupService', { useClass: ChromePopupService });
container.register<IRewriteRuleRepository>('IRewriteRuleRepository', { useClass: DexieRewriteRuleRepository });
container.register<IWindowService>('IWindowService', { useClass: ChromeWindowService });
container.register<ISelectedPageTextRepository>('ISelectedPageTextRepository', { useClass: SelectedPageTextRepository });

// Register concrete classes (required for container.resolve() to work)
container.register(HandleContextMenuReplaceDomElement, { useClass: HandleContextMenuReplaceDomElement });
container.register(ContextMenuSetupUseCase, { useClass: ContextMenuSetupUseCase });
container.register(DexieRewriteRuleRepository, { useClass: DexieRewriteRuleRepository });
container.register(LoadRewriteRuleForEditUseCase, { useClass: LoadRewriteRuleForEditUseCase });
container.register(UpdateRewriteRuleUseCase, { useClass: UpdateRewriteRuleUseCase });
container.register(CloseCurrentWindowUseCase, { useClass: CloseCurrentWindowUseCase });
container.register(GetSelectedPageTextUseCase, { useClass: GetSelectedPageTextUseCase });
