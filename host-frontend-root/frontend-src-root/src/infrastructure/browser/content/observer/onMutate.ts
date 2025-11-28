import { CollectAddedNodesUseCase } from 'src/application/usecases/onDomChangeDetected/CollectAddedNodesUseCase';
import { ScheduleRuleApplicationUseCase } from 'src/application/usecases/onDomChangeDetected/ScheduleRuleApplicationUseCase';
import { ApplyRulesToMutatedNodesUseCase } from 'src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * Content Script用のMutationObserverを登録し、DOM更新を監視してrewrite rulesを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 */
export function observerOnMutate() {
  let isApplyingRules = false;
  const pendingNodes: Set<Element> = new Set();

  const applyRulesToPendingNodes = async () => {
    if (pendingNodes.size === 0) {
      return;
    }

    const nodesToProcess = Array.from(pendingNodes);
    pendingNodes.clear();

    isApplyingRules = true;

    try {
      const rewriteRuleRepository = new ChromeRuntimeRewriteRuleRepository();
      const chromeCurrentTabService = new ChromeCurrentTabService();
      const useCase = new ApplyRulesToMutatedNodesUseCase(rewriteRuleRepository, chromeCurrentTabService);

      await useCase.applyRules(
        nodesToProcess,
        (node) => document.body.contains(node)
      );
    } finally {
      isApplyingRules = false;
    }
  };

  const collectAddedNodesUseCase = new CollectAddedNodesUseCase(pendingNodes);
  const scheduleRuleApplicationUseCase = new ScheduleRuleApplicationUseCase(applyRulesToPendingNodes);

  const handleMutations = (mutations: MutationRecord[]) => {
    if (isApplyingRules) {
      return;
    }

    collectAddedNodesUseCase.exec(mutations);
    scheduleRuleApplicationUseCase.exec();
  };

  const observer = new MutationObserver(handleMutations);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
