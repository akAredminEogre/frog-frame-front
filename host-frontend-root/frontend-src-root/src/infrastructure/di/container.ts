import { asClass, createContainer, InjectionMode } from 'awilix';

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

// Create Awilix container with CLASSIC injection mode (constructor parameter names)
const awilixContainer = createContainer({
  injectionMode: InjectionMode.CLASSIC,
  strict: true
});

// Register implementations for interfaces
awilixContainer.register({
  // Infrastructure services (interfaces)
  chromeTabsService: asClass(ChromeTabsService).singleton(),
  popupService: asClass(ChromePopupService).singleton(),
  rewriteRuleRepository: asClass(DexieRewriteRuleRepository).singleton(),
  windowService: asClass(ChromeWindowService).singleton(),
  selectedPageTextRepository: asClass(SelectedPageTextRepository).singleton(),
  currentTabService: asClass(ChromeCurrentTabService).singleton(),
  chromeRuntimeService: asClass(ChromeRuntimeService).singleton(),
  getSelectionService: asClass(GetSelectionService).singleton(),

  // Use Cases
  handleContextMenuReplaceDomElement: asClass(HandleContextMenuReplaceDomElement).singleton(),
  contextMenuSetupUseCase: asClass(ContextMenuSetupUseCase).singleton(),
  loadRewriteRuleForEditUseCase: asClass(LoadRewriteRuleForEditUseCase).singleton(),
  updateRewriteRuleUseCase: asClass(UpdateRewriteRuleUseCase).singleton(),
  closeCurrentWindowUseCase: asClass(CloseCurrentWindowUseCase).singleton(),
  saveRewriteRuleAndApplyToCurrentTabUseCase: asClass(SaveRewriteRuleAndApplyToCurrentTabUseCase).singleton(),
  popupInitFormUseCase: asClass(PopupInitFormUseCase).singleton(),

  // Concrete classes for direct resolution
  dexieRewriteRuleRepository: asClass(DexieRewriteRuleRepository).singleton(),
  chromeCurrentTabService: asClass(ChromeCurrentTabService).singleton()
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

// Type-safe class resolution mapping
type ClassTokenMap = {
  [K in keyof typeof classToKeyMap extends infer U ? U : never]: K extends Function ? InstanceType<K & (new (...args: any[]) => any)> : never;
};

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
