import 'reflect-metadata';

import { container } from 'tsyringe';

// Create a child container for Content Script context
export const contentContainer = container.createChildContainer();

// Register Content Script specific implementations
import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';

// Content Script uses ChromeRuntimeRewriteRuleRepository instead of DexieRewriteRuleRepository
// because Content Script cannot directly access IndexedDB - it communicates via Chrome Runtime Messaging
contentContainer.register<IRewriteRuleRepository>('IRewriteRuleRepository', { useClass: ChromeRuntimeRewriteRuleRepository });

// Content Script uses WindowCurrentUrlService to get current URL from window.location.href
// (chrome.tabs API is not available in content scripts)
contentContainer.register<ICurrentUrlService>('ICurrentUrlService', { useClass: WindowCurrentUrlService });

// Note: UseCase classes are manually instantiated in handlers (applyAllRulesHandler.ts)
// due to tsyringe decorator metadata issues with SWC bundler
