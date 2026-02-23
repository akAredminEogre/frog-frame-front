import { asValue, createContainer } from 'awilix';

import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IGetSelectionService } from 'src/application/ports/IGetSelectionService';
import { IPopupService } from 'src/application/ports/IPopupService';
import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';
import { IWindowService } from 'src/application/ports/IWindowService';
import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { PopupInitFormUseCase } from 'src/application/usecases/popup/PopupInitFormUseCase';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { CloseCurrentWindowUseCase } from 'src/application/usecases/window/CloseCurrentWindowUseCase';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ChromeTabsGateway } from 'src/frameworks-and-drivers/browser/ChromeTabsGateway';
import { RewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { ChromePopupService } from 'src/infrastructure/browser/popup/ChromePopupService';
import { ChromeRuntimeService } from 'src/infrastructure/browser/runtime/ChromeRuntimeService';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { ChromeWindowService } from 'src/infrastructure/browser/window/ChromeWindowService';
import { SelectedPageTextRepository } from 'src/infrastructure/persistence/storage/SelectedPageTextRepository';
import { GetSelectionService } from 'src/infrastructure/windows/getSelectionService';
import { DeleteRuleControllerFactory } from 'src/interface-adapters/factories/DeleteRuleControllerFactory';
import { ExportRulesJsonControllerFactory } from 'src/interface-adapters/factories/ExportRulesJsonControllerFactory';
import { IDeleteRuleControllerFactory } from 'src/interface-adapters/factories/IDeleteRuleControllerFactory';
import { IExportRulesJsonControllerFactory } from 'src/interface-adapters/factories/IExportRulesJsonControllerFactory';
import { IImportRulesJsonControllerFactory } from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';
import { ImportRulesJsonControllerFactory } from 'src/interface-adapters/factories/ImportRulesJsonControllerFactory';
import { IToggleRuleActiveControllerFactory } from 'src/interface-adapters/factories/IToggleRuleActiveControllerFactory';
import { ToggleRuleActiveControllerFactory } from 'src/interface-adapters/factories/ToggleRuleActiveControllerFactory';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';

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
  chromeTabsService,
  selectedPageTextRepository,
  popupService
);
const contextMenuSetupUseCase = new ContextMenuSetupUseCase();
const loadRewriteRuleForEditUseCase = new LoadRewriteRuleForEditUseCase(rewriteRuleRepository);
const updateRewriteRuleUseCase = new UpdateRewriteRuleUseCase(
  rewriteRuleRepository,
  chromeTabsService
);
const closeCurrentWindowUseCase = new CloseCurrentWindowUseCase(windowService);
const saveRewriteRuleAndApplyToCurrentTabUseCase = new SaveRewriteRuleAndApplyToCurrentTabUseCase(
  rewriteRuleRepository,
  currentTabService,
  chromeRuntimeService
);
const popupInitFormUseCase = new PopupInitFormUseCase(currentTabService, selectedPageTextRepository);

// Toggle Rule Active feature
const chromeTabsGateway = new ChromeTabsGateway();
const toggleRuleActiveControllerFactory = new ToggleRuleActiveControllerFactory(
  rewriteRuleRepository,
  chromeTabsGateway
);
const deleteRuleControllerFactory = new DeleteRuleControllerFactory(
  rewriteRuleRepository,
  chromeTabsGateway
);
// Import Rules JSON feature
const importRulesJsonControllerFactory = new ImportRulesJsonControllerFactory(
  rewriteRuleRepository
);
// Export Rules JSON feature
const exportRulesJsonControllerFactory = new ExportRulesJsonControllerFactory(
  rewriteRuleRepository
);
// NOTE: Background contextでは DexieRewriteRuleRepository を直接使用するため、
// RewriteRuleMessagingService の getAll() は呼ばれない（Mapper 経由の getAllRules は未使用）
const rewriteRuleMessagingService = new RewriteRuleMessagingService();
const rewriteRuleMapper = new RewriteRuleMapper(rewriteRuleMessagingService);

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
  chromeCurrentTabService: asValue(currentTabService),

  // Toggle Rule Active feature
  toggleRuleActiveControllerFactory: asValue(toggleRuleActiveControllerFactory),
  rewriteRuleMapper: asValue(rewriteRuleMapper),
  chromeTabsGateway: asValue(chromeTabsGateway),
  rewriteRuleMessagingService: asValue(rewriteRuleMessagingService),

  // Delete Rule feature
  deleteRuleControllerFactory: asValue(deleteRuleControllerFactory),

  // Import Rules JSON feature
  importRulesJsonControllerFactory: asValue(importRulesJsonControllerFactory),

  // Export Rules JSON feature
  exportRulesJsonControllerFactory: asValue(exportRulesJsonControllerFactory)
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

  // Toggle Rule Active feature
  toggleRuleActiveControllerFactory: IToggleRuleActiveControllerFactory;
  rewriteRuleMapper: RewriteRuleMapper;
  chromeTabsGateway: ChromeTabsGateway;
  rewriteRuleMessagingService: RewriteRuleMessagingService;

  // Delete Rule feature
  deleteRuleControllerFactory: IDeleteRuleControllerFactory;

  // Import Rules JSON feature
  importRulesJsonControllerFactory: IImportRulesJsonControllerFactory;

  // Export Rules JSON feature
  exportRulesJsonControllerFactory: IExportRulesJsonControllerFactory;
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
  | 'IGetSelectionService'
  | 'IToggleRuleActiveControllerFactory'
  | 'IDeleteRuleControllerFactory'
  | 'IImportRulesJsonControllerFactory'
  | 'IExportRulesJsonControllerFactory'
  | 'ITabsGateway'
  | 'IRewriteRuleMessagingPort';

const interfaceToKeyMap: Record<InterfaceToken, keyof ContainerCradle> = {
  'IChromeTabsService': 'chromeTabsService',
  'IPopupService': 'popupService',
  'IRewriteRuleRepository': 'rewriteRuleRepository',
  'IWindowService': 'windowService',
  'ISelectedPageTextRepository': 'selectedPageTextRepository',
  'ICurrentTabService': 'currentTabService',
  'IChromeRuntimeService': 'chromeRuntimeService',
  'IGetSelectionService': 'getSelectionService',
  'IToggleRuleActiveControllerFactory': 'toggleRuleActiveControllerFactory',
  'IDeleteRuleControllerFactory': 'deleteRuleControllerFactory',
  'IImportRulesJsonControllerFactory': 'importRulesJsonControllerFactory',
  'IExportRulesJsonControllerFactory': 'exportRulesJsonControllerFactory',
  'ITabsGateway': 'chromeTabsGateway',
  'IRewriteRuleMessagingPort': 'rewriteRuleMessagingService'
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
  [ChromeCurrentTabService, 'chromeCurrentTabService'],
  [ToggleRuleActiveControllerFactory, 'toggleRuleActiveControllerFactory'],
  [DeleteRuleControllerFactory, 'deleteRuleControllerFactory'],
  [ImportRulesJsonControllerFactory, 'importRulesJsonControllerFactory'],
  [ExportRulesJsonControllerFactory, 'exportRulesJsonControllerFactory'],
  [RewriteRuleMapper, 'rewriteRuleMapper'],
  [ChromeTabsGateway, 'chromeTabsGateway'],
  [RewriteRuleMessagingService, 'rewriteRuleMessagingService']
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
  resolve(token: typeof ToggleRuleActiveControllerFactory): ToggleRuleActiveControllerFactory;
  resolve(token: typeof DeleteRuleControllerFactory): DeleteRuleControllerFactory;
  resolve(token: typeof ImportRulesJsonControllerFactory): ImportRulesJsonControllerFactory;
  resolve(token: typeof ExportRulesJsonControllerFactory): ExportRulesJsonControllerFactory;
  resolve(token: typeof RewriteRuleMapper): RewriteRuleMapper;
  resolve(token: typeof ChromeTabsGateway): ChromeTabsGateway;
  resolve(token: typeof RewriteRuleMessagingService): RewriteRuleMessagingService;
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

// Attach internal data for test introspection (similar to tsyringe's _registry)
(container as any)._interfaceToKeyMap = interfaceToKeyMap;
(container as any)._classToKeyMap = classToKeyMap;
(container as any)._awilixContainer = awilixContainer;
