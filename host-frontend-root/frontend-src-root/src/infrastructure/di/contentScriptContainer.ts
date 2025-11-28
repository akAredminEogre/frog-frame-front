import 'reflect-metadata';

import { container } from 'tsyringe';

import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { HandleMutationsUseCase } from 'src/application/usecases/onDomChangeDetected/HandleMutationsUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';

// Create a child container for content script context
export const contentScriptContainer = container.createChildContainer();

// Register Content Script specific implementations
contentScriptContainer.register<IRewriteRuleRepository>('IRewriteRuleRepository', { useClass: ChromeRuntimeRewriteRuleRepository });
contentScriptContainer.register<ICurrentTabService>('ICurrentTabService', { useClass: ChromeCurrentTabService });

// Register use cases
contentScriptContainer.register(HandleMutationsUseCase, { useClass: HandleMutationsUseCase });
