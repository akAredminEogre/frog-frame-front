import { asValue, createContainer } from 'awilix';

import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IGetSelectionService } from 'src/application/ports/IGetSelectionService';
import { IPopupService } from 'src/application/ports/IPopupService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';
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
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
import { SelectedPageTextRepository } from 'src/infrastructure/persistence/storage/SelectedPageTextRepository';
import { GetSelectionService } from 'src/infrastructure/windows/getSelectionService';

// Create Awilix container
const awilixContainer = createContainer({
  strict: true
});

// Infrastructure services (singleton instances)
const chromeTabsService = new ChromeTabsService();
const popupService = new ChromePopupService();
const rewriteRuleRepository = new DexieRewriteRuleRepository();
const windowService = new ChromeWindowService();
const selectedPageTextRepository = new SelectedPageTextRepository();
const currentTabService = new ChromeCurrentTabService();
const chromeRuntimeService = new ChromeRuntimeService();
const getSelectionService = new GetSelectionService();

// Use Cases (singleton instances with manual dependency injection)
// ミニファイ後もパラメータ名に依存しないよう、手動でインスタンスを生成
const handleContextMenuReplaceDomElement = new HandleContextMenuReplaceDomElement(
  rewriteRuleRepository,
  chromeTabsService,
  selectedPageTextRepository,
  getSelectionService
);
const contextMenuSetupUseCase = new ContextMenuSetupUseCase();
const loadRewriteRuleForEditUseCase = new LoadRewriteRuleForEditUseCase(rewriteRuleRepository);
const updateRewriteRuleUseCase = new UpdateRewriteRuleUseCase(
  rewriteRuleRepository,
  chromeTabsService,
  chromeRuntimeService
);
const closeCurrentWindowUseCase = new CloseCurrentWindowUseCase(windowService);
const saveRewriteRuleAndApplyToCurrentTabUseCase = new SaveRewriteRuleAndApplyToCurrentTabUseCase(
  rewriteRuleRepository,
  currentTabService,
  chromeRuntimeService
);
const popupInitFormUseCase = new PopupInitFormUseCase(popupService, selectedPageTextRepository);

// Register all instances with asValue (no automatic injection needed)
awilixContainer.register({
  // Infrastructure services
  chromeTabsService: asValue(chromeTabsService),
  popupService: asValue(popupService),
  rewriteRuleRepository: asValue(rewriteRuleRepository),
  windowService: asValue(windowService),
  selectedPageTextRepository: asValue(selectedPageTextRepository),
  currentTabService: asValue(currentTabService),
  chromeRuntimeService: asValue(chromeRuntimeService),
  getSelectionService: asValue(getSelectionService),

  // Use Cases
  handleContextMenuReplaceDomElement: asValue(handleContextMenuReplaceDomElement),
  contextMenuSetupUseCase: asValue(contextMenuSetupUseCase),
  loadRewriteRuleForEditUseCase: asValue(loadRewriteRuleForEditUseCase),
  updateRewriteRuleUseCase: asValue(updateRewriteRuleUseCase),
  closeCurrentWindowUseCase: asValue(closeCurrentWindowUseCase),
  saveRewriteRuleAndApplyToCurrentTabUseCase: asValue(saveRewriteRuleAndApplyToCurrentTabUseCase),
  popupInitFormUseCase: asValue(popupInitFormUseCase),

  // Concrete classes for direct resolution (aliases)
  dexieRewriteRuleRepository: asValue(rewriteRuleRepository),
  chromeCurrentTabService: asValue(currentTabService)
});

// Type definitions for container resolution
interface ContainerCradle {
  // Interface implementations
  chromeTabsService: IChromeTabsService;
  popupService: IPopupService;
  rewriteRuleRepository: IRewriteRuleRepository;
  windowService: IWindowService;
  selectedPageTextRepository: ISelectedPageTextRepository;
  currentTabService: ICurrentTabService;
  chromeRuntimeService: IChromeRuntimeService;
  getSelectionService: IGetSelectionService;

  // Use Cases
  handleContextMenuReplaceDomElement: HandleContextMenuReplaceDomElement;
  contextMenuSetupUseCase: ContextMenuSetupUseCase;
  loadRewriteRuleForEditUseCase: LoadRewriteRuleForEditUseCase;
  updateRewriteRuleUseCase: UpdateRewriteRuleUseCase;
  closeCurrentWindowUseCase: CloseCurrentWindowUseCase;
  saveRewriteRuleAndApplyToCurrentTabUseCase: SaveRewriteRuleAndApplyToCurrentTabUseCase;
  popupInitFormUseCase: PopupInitFormUseCase;

  // Concrete classes
  dexieRewriteRuleRepository: DexieRewriteRuleRepository;
  chromeCurrentTabService: ChromeCurrentTabService;
}

// Token mappings for interface-based resolution (legacy compatibility)
type InterfaceToken =
  | 'IChromeTabsService'
  | 'IPopupService'
  | 'IRewriteRuleRepository'
  | 'IWindowService'
  | 'ISelectedPageTextRepository'
  | 'ICurrentTabService'
  | 'IChromeRuntimeService'
  | 'IGetSelectionService';

const interfaceToKeyMap: Record<InterfaceToken, keyof ContainerCradle> = {
  'IChromeTabsService': 'chromeTabsService',
  'IPopupService': 'popupService',
  'IRewriteRuleRepository': 'rewriteRuleRepository',
  'IWindowService': 'windowService',
  'ISelectedPageTextRepository': 'selectedPageTextRepository',
  'ICurrentTabService': 'currentTabService',
  'IChromeRuntimeService': 'chromeRuntimeService',
  'IGetSelectionService': 'getSelectionService'
};

// Class to key mappings for class-based resolution
const classToKeyMap = new Map<Function, keyof ContainerCradle>([
  [HandleContextMenuReplaceDomElement, 'handleContextMenuReplaceDomElement'],
  [ContextMenuSetupUseCase, 'contextMenuSetupUseCase'],
  [LoadRewriteRuleForEditUseCase, 'loadRewriteRuleForEditUseCase'],
  [UpdateRewriteRuleUseCase, 'updateRewriteRuleUseCase'],
  [CloseCurrentWindowUseCase, 'closeCurrentWindowUseCase'],
  [SaveRewriteRuleAndApplyToCurrentTabUseCase, 'saveRewriteRuleAndApplyToCurrentTabUseCase'],
  [PopupInitFormUseCase, 'popupInitFormUseCase'],
  [DexieRewriteRuleRepository, 'dexieRewriteRuleRepository'],
  [ChromeTabsService, 'chromeTabsService'],
  [ChromeCurrentTabService, 'chromeCurrentTabService']
]);

// Container interface with overloaded resolve
interface Container {
  resolve(token: typeof HandleContextMenuReplaceDomElement): HandleContextMenuReplaceDomElement;
  resolve(token: typeof ContextMenuSetupUseCase): ContextMenuSetupUseCase;
  resolve(token: typeof LoadRewriteRuleForEditUseCase): LoadRewriteRuleForEditUseCase;
  resolve(token: typeof UpdateRewriteRuleUseCase): UpdateRewriteRuleUseCase;
  resolve(token: typeof CloseCurrentWindowUseCase): CloseCurrentWindowUseCase;
  resolve(token: typeof SaveRewriteRuleAndApplyToCurrentTabUseCase): SaveRewriteRuleAndApplyToCurrentTabUseCase;
  resolve(token: typeof PopupInitFormUseCase): PopupInitFormUseCase;
  resolve(token: typeof DexieRewriteRuleRepository): DexieRewriteRuleRepository;
  resolve(token: typeof ChromeTabsService): ChromeTabsService;
  resolve(token: typeof ChromeCurrentTabService): ChromeCurrentTabService;
  resolve<T>(token: InterfaceToken): T;
  resolve<T>(token: Function): T;
}

// Wrapper to provide tsyringe-compatible API
export const container: Container = {
  resolve(token: InterfaceToken | Function): any {
    // Interface token resolution
    if (typeof token === 'string') {
      const key = interfaceToKeyMap[token as InterfaceToken];
      if (!key) {
        throw new Error(`Unknown interface token: ${token}`);
      }
      return awilixContainer.resolve(key);
    }

    // Class-based resolution
    const key = classToKeyMap.get(token);
    if (!key) {
      throw new Error(`Unknown class token: ${(token as any).name}`);
    }
    return awilixContainer.resolve(key);
  }
};
