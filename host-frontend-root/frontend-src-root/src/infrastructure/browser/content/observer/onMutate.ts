import { ApplyRulesToMutatedNodesUseCase } from 'src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase';
import { ContentCurrentTabService } from 'src/infrastructure/browser/content/tabs/ContentCurrentTabService';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';

const DEBOUNCE_DELAY_MS = 100;

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * Content Script用のMutationObserverを登録し、DOM更新を監視してrewrite rulesを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 */
export function observerOnMutate() {
  let isApplyingRules = false;
  const pendingNodes: Set<Element> = new Set();
  let debounceTimer: number | null = null;

  const applyRulesToPendingNodes = async () => {
    if (pendingNodes.size === 0) {
      return;
    }

    const nodesToProcess = Array.from(pendingNodes);
    pendingNodes.clear();
    debounceTimer = null;

    isApplyingRules = true;

    try {
      const rewriteRuleRepository = new ChromeRuntimeRewriteRuleRepository();
      const contentCurrentTabService = new ContentCurrentTabService();
      const useCase = new ApplyRulesToMutatedNodesUseCase(rewriteRuleRepository, contentCurrentTabService);

      await useCase.applyRules(
        nodesToProcess,
        (node) => document.body.contains(node)
      );
    } finally {
      isApplyingRules = false;
    }
  };

  const scheduleRuleApplication = () => {
    if (debounceTimer !== null) {
      window.clearTimeout(debounceTimer);
    }

    debounceTimer = window.setTimeout(() => {
      applyRulesToPendingNodes();
    }, DEBOUNCE_DELAY_MS);
  };

  const collectAddedNodes = (mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          pendingNodes.add(node);
        }
      });
    });
  };

  const handleMutations = (mutations: MutationRecord[]) => {
    if (isApplyingRules) {
      return;
    }

    collectAddedNodes(mutations);
    scheduleRuleApplication();
  };

  const observer = new MutationObserver(handleMutations);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
