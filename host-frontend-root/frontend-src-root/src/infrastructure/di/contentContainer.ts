import { asValue, createContainer } from 'awilix';

import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { IGetSelectionService } from 'src/application/ports/IGetSelectionService';
import { IObserverControl } from 'src/application/ports/IObserverControl';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';
import { GetElementSelectionUseCase } from 'src/application/usecases/selection/GetElementSelectionUseCase';
import { IDomRootChecker } from 'src/domain/ports/IDomRootChecker';
import { observerControl } from 'src/infrastructure/browser/content/observer/observerState';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';
import { DomRootChecker } from 'src/infrastructure/document/DomRootChecker';
import { GetSelectionService } from 'src/infrastructure/windows/getSelectionService';

// Create Awilix container for content script
const awilixContainer = createContainer({
  strict: true
});

// Infrastructure services (singleton instances)
const chromeRuntimeRewriteRuleRepository = new ChromeRuntimeRewriteRuleRepository();
const windowCurrentUrlService = new WindowCurrentUrlService();
const debounceTimer = new DebounceTimer();
const getSelectionService = new GetSelectionService();
const domRootChecker = new DomRootChecker();

// Use Cases (singleton instances with manual dependency injection)
// ミニファイ後もパラメータ名に依存しないよう、手動でインスタンスを生成
const applyRulesOnDomMutationUseCase = new ApplyRulesOnDomMutationUseCase(
  chromeRuntimeRewriteRuleRepository,
  windowCurrentUrlService,
  debounceTimer,
  observerControl
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

  // Use Cases
  applyRulesOnDomMutationUseCase: ApplyRulesOnDomMutationUseCase;
  getElementSelectionUseCase: GetElementSelectionUseCase;
}

// Class to key mappings for class-based resolution
const classToKeyMap = new Map<Function, keyof ContentContainerCradle>([
  [ApplyRulesOnDomMutationUseCase, 'applyRulesOnDomMutationUseCase'],
  [GetElementSelectionUseCase, 'getElementSelectionUseCase'],
  [ChromeRuntimeRewriteRuleRepository, 'chromeRuntimeRewriteRuleRepository'],
  [WindowCurrentUrlService, 'windowCurrentUrlService'],
  [DebounceTimer, 'debounceTimer'],
  [GetSelectionService, 'getSelectionService'],
  [DomRootChecker, 'domRootChecker']
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
  resolve<T>(token: Function): T;
}

// Wrapper to provide container API
export const contentContainer: ContentContainer = {
  resolve(token: Function): any {
    const key = classToKeyMap.get(token);
    if (!key) {
      throw new Error(`Unknown class token: ${(token as any).name}`);
    }
    return awilixContainer.resolve(key);
  }
};
