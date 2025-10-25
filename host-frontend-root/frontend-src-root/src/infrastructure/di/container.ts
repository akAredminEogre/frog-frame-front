import 'reflect-metadata';

import { container } from 'tsyringe';

// Export the tsyringe container for use throughout the application
export { container };

// Register services with tsyringe
import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IPopupService } from 'src/application/ports/IPopupService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';
import { ISelectedPageTextService } from 'src/application/ports/ISelectedPageTextService';
import { IWindowService } from 'src/application/ports/IWindowService';
import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { PopupInitFormUseCase } from 'src/application/usecases/popup/PopupInitFormUseCase';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { CloseCurrentWindowUseCase } from 'src/application/usecases/window/CloseCurrentWindowUseCase';
import { ChromePopupService } from 'src/infrastructure/browser/popup/ChromePopupService';
import { ChromeRuntimeService } from 'src/infrastructure/browser/runtime/ChromeRuntimeService';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { ChromeWindowService } from 'src/infrastructure/browser/window/ChromeWindowService';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository';
import { SelectedPageTextService } from 'src/infrastructure/persistance/storage/SelectedPageTextService';
import { SelectedPageTextRepository } from 'src/infrastructure/storage/SelectedPageTextRepository';

// Register implementations for interfaces (抽象化のため)
container.register<IChromeTabsService>('IChromeTabsService', { useClass: ChromeTabsService });
container.register<ISelectedPageTextService>('ISelectedPageTextService', { useClass: SelectedPageTextService });
container.register<IPopupService>('IPopupService', { useClass: ChromePopupService });
container.register<IRewriteRuleRepository>('IRewriteRuleRepository', { useClass: DexieRewriteRuleRepository });
container.register<IWindowService>('IWindowService', { useClass: ChromeWindowService });
container.register<ISelectedPageTextRepository>('ISelectedPageTextRepository', { useClass: SelectedPageTextRepository });
container.register<ICurrentTabService>('ICurrentTabService', { useClass: ChromeCurrentTabService });
container.register<IChromeRuntimeService>('IChromeRuntimeService', { useClass: ChromeRuntimeService });

// Register concrete classes (required for container.resolve() to work)
container.register(HandleContextMenuReplaceDomElement, { useClass: HandleContextMenuReplaceDomElement });
container.register(ContextMenuSetupUseCase, { useClass: ContextMenuSetupUseCase });
container.register(DexieRewriteRuleRepository, { useClass: DexieRewriteRuleRepository });
container.register(LoadRewriteRuleForEditUseCase, { useClass: LoadRewriteRuleForEditUseCase });
container.register(UpdateRewriteRuleUseCase, { useClass: UpdateRewriteRuleUseCase });
container.register(CloseCurrentWindowUseCase, { useClass: CloseCurrentWindowUseCase });
container.register(SaveRewriteRuleAndApplyToCurrentTabUseCase, { useClass: SaveRewriteRuleAndApplyToCurrentTabUseCase });
container.register(PopupInitFormUseCase, { useClass: PopupInitFormUseCase });
