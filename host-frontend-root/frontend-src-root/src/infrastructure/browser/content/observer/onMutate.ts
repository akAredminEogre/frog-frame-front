import { HandleMutationsUseCase } from 'src/application/usecases/onDomChangeDetected/HandleMutationsUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * Content Script用のMutationObserverを登録し、DOM更新を監視してrewrite rulesを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 */
export function observerOnMutate() {
  const repository = new ChromeRuntimeRewriteRuleRepository();
  const currentTabService = new ChromeCurrentTabService();
  const handleMutationsUseCase = new HandleMutationsUseCase(repository, currentTabService);

  const observer = new MutationObserver((mutations) => {
    handleMutationsUseCase.exec(mutations);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
