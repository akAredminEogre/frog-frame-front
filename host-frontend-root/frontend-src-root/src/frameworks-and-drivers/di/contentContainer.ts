import { asValue, createContainer } from 'awilix';

import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { IGetSelectionService } from 'src/application/ports/IGetSelectionService';
import { IObserverControl } from 'src/application/ports/IObserverControl';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';
import { GetElementSelectionUseCase } from 'src/application/usecases/selection/GetElementSelectionUseCase';
import { IDomRootChecker } from 'src/domain/ports/IDomRootChecker';
import { IElementFactory } from 'src/domain/ports/IElementFactory';
import { RewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';
import { ChromeRuntimeRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/ChromeRuntimeRewriteRuleRepository';
import { observerControl } from 'src/infrastructure/browser/content/observer/observerState';
import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';
import { DomRootChecker } from 'src/infrastructure/document/DomRootChecker';
import { ElementFactory } from 'src/infrastructure/document/ElementFactory';
import { GetSelectionService } from 'src/infrastructure/windows/getSelectionService';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';

// Create Awilix container for content script
const awilixContainer = createContainer({
  strict: true
});

// Infrastructure services (singleton instances)
// ADR-002, ADR-003に準拠した依存関係チェーン:
// MessagingService → Mapper → Repository
const rewriteRuleMessagingService = new RewriteRuleMessagingService();
const rewriteRuleMapper = new RewriteRuleMapper(rewriteRuleMessagingService);
const chromeRuntimeRewriteRuleRepository = new ChromeRuntimeRewriteRuleRepository(rewriteRuleMapper);
const windowCurrentUrlService = new WindowCurrentUrlService();
const debounceTimer = new DebounceTimer();
const getSelectionService = new GetSelectionService();
const domRootChecker = new DomRootChecker();
const elementFactory = new ElementFactory();

// Use Cases (singleton instances with manual dependency injection)
// ミニファイ後もパラメータ名に依存しないよう、手動でインスタンスを生成
const applyRulesOnDomMutationUseCase = new ApplyRulesOnDomMutationUseCase(
  chromeRuntimeRewriteRuleRepository,
  windowCurrentUrlService,
  debounceTimer,
  observerControl,
  domRootChecker,
  elementFactory
);

const getElementSelectionUseCase = new GetElementSelectionUseCase(getSelectionService, domRootChecker);

// Register all instances with asValue (no automatic injection needed)
awilixContainer.register({
  // Infrastructure services
  chromeRuntimeRewriteRuleRepository: asValue(chromeRuntimeRewriteRuleRepository),
  windowCurrentUrlService: asValue(windowCurrentUrlService),
  debounceTimer: asValue(debounceTimer),
  observerControl: asValue(observerControl),
  getSelectionService: asValue(getSelectionService),
  domRootChecker: asValue(domRootChecker),
  elementFactory: asValue(elementFactory),

  // Use Cases
  applyRulesOnDomMutationUseCase: asValue(applyRulesOnDomMutationUseCase),
  getElementSelectionUseCase: asValue(getElementSelectionUseCase)
});

// Type definitions for container resolution
interface ContentContainerCradle {
  // Interface implementations
  chromeRuntimeRewriteRuleRepository: IRewriteRuleRepository;
  windowCurrentUrlService: ICurrentUrlService;
  debounceTimer: IDebounceTimer;
  observerControl: IObserverControl;
  getSelectionService: IGetSelectionService;
  domRootChecker: IDomRootChecker;
  elementFactory: IElementFactory;

  // Use Cases
  applyRulesOnDomMutationUseCase: ApplyRulesOnDomMutationUseCase;
  getElementSelectionUseCase: GetElementSelectionUseCase;
}

// Token mappings for interface-based resolution
type InterfaceToken =
  | 'IRewriteRuleRepository'
  | 'ICurrentUrlService'
  | 'IDebounceTimer'
  | 'IObserverControl'
  | 'IGetSelectionService'
  | 'IDomRootChecker'
  | 'IElementFactory';

const interfaceToKeyMap: Record<InterfaceToken, keyof ContentContainerCradle> = {
  'IRewriteRuleRepository': 'chromeRuntimeRewriteRuleRepository',
  'ICurrentUrlService': 'windowCurrentUrlService',
  'IDebounceTimer': 'debounceTimer',
  'IObserverControl': 'observerControl',
  'IGetSelectionService': 'getSelectionService',
  'IDomRootChecker': 'domRootChecker',
  'IElementFactory': 'elementFactory'
};

// Class to key mappings for class-based resolution
const classToKeyMap = new Map<Function, keyof ContentContainerCradle>([
  [ApplyRulesOnDomMutationUseCase, 'applyRulesOnDomMutationUseCase'],
  [GetElementSelectionUseCase, 'getElementSelectionUseCase'],
  [ChromeRuntimeRewriteRuleRepository, 'chromeRuntimeRewriteRuleRepository'],
  [WindowCurrentUrlService, 'windowCurrentUrlService'],
  [DebounceTimer, 'debounceTimer'],
  [GetSelectionService, 'getSelectionService'],
  [DomRootChecker, 'domRootChecker'],
  [ElementFactory, 'elementFactory']
]);

// Container interface with overloaded resolve
interface ContentContainer {
  resolve(token: typeof ApplyRulesOnDomMutationUseCase): ApplyRulesOnDomMutationUseCase;
  resolve(token: typeof GetElementSelectionUseCase): GetElementSelectionUseCase;
  resolve(token: typeof ChromeRuntimeRewriteRuleRepository): ChromeRuntimeRewriteRuleRepository;
  resolve(token: typeof WindowCurrentUrlService): WindowCurrentUrlService;
  resolve(token: typeof DebounceTimer): DebounceTimer;
  resolve(token: typeof GetSelectionService): GetSelectionService;
  resolve(token: typeof DomRootChecker): DomRootChecker;
  resolve(token: typeof ElementFactory): ElementFactory;
  resolve<T>(token: InterfaceToken): T;
  resolve<T>(token: Function): T;
}

// Wrapper to provide container API
export const contentContainer: ContentContainer = {
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
(contentContainer as any)._interfaceToKeyMap = interfaceToKeyMap;
(contentContainer as any)._classToKeyMap = classToKeyMap;
(contentContainer as any)._awilixContainer = awilixContainer;
