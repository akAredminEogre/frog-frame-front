import { domMutationUseCaseInstance } from 'src/infrastructure/browser/content/instance/domMutationUseCaseInstance';
import { setObserver } from 'src/infrastructure/browser/content/observer/observerState';

// Re-export for backward compatibility
export { disconnectObserver, reconnectObserver } from 'src/infrastructure/browser/content/observer/observerState';

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * Content Script用のMutationObserverを登録し、DOM更新を監視してrewrite rulesを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 *
 * domMutationUseCaseInstanceはシングルトンで、applyAllRulesHandler.tsと共有される
 * これにより、ページロード時とDOM Mutation時のルール適用の状態管理が簡素化される
 */
export function observerOnMutate() {
  const observer = new MutationObserver((mutations) => {
    domMutationUseCaseInstance.handleMutations(mutations);
  });
  setObserver(observer);
  observer.observe(document.body, { childList: true, subtree: true });
}
