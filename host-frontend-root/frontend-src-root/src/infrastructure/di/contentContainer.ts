import { asClass, AwilixContainer, createContainer, InjectionMode } from 'awilix';

import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';

// Content Script用のAwilixコンテナを作成
// Content Scriptは別のコンテキストで動作するため、独自のコンテナを持つ
export const contentContainer: AwilixContainer = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

// Content Script specific implementations
// Content Script uses ChromeRuntimeRewriteRuleRepository instead of DexieRewriteRuleRepository
// because Content Script cannot directly access IndexedDB - it communicates via Chrome Runtime Messaging
contentContainer.register({
  rewriteRuleRepository: asClass(ChromeRuntimeRewriteRuleRepository).singleton(),

  // Content Script uses WindowCurrentUrlService to get current URL from window.location.href
  // (chrome.tabs API is not available in content scripts)
  currentUrlService: asClass(WindowCurrentUrlService).singleton()
});

// Note: UseCase classes are manually instantiated in handlers (applyAllRulesHandler.ts)
// Awilixでは decorator metadata 問題は発生しないが、
// content scriptではシンプルな手動インスタンス化を維持
