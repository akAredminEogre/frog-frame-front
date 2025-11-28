import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { WindowLocationService } from 'src/infrastructure/windows/WindowLocationService';

const DEBOUNCE_DELAY_MS = 100;

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * Content Script用のMutationObserverを登録し、DOM更新を監視してrewrite rulesを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 */
export function observerOnMutate() {
  const windowLocationService = new WindowLocationService();
  const currentUrl = windowLocationService.getCurrentUrl();

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
      const useCase = new ApplySavedRulesOnPageLoadUseCase(rewriteRuleRepository);

      for (const node of nodesToProcess) {
        if (document.body.contains(node)) {
          await useCase.applyAllRules(node, currentUrl);
        }
      }
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
