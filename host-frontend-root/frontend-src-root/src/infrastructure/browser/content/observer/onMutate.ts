import { HandleMutationsUseCase } from 'src/application/usecases/onDomChangeDetected/HandleMutationsUseCase';
import { contentScriptContainer } from 'src/infrastructure/di/contentScriptContainer';

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * Content Script用のMutationObserverを登録し、DOM更新を監視してrewrite rulesを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 */
export function observerOnMutate() {
  const handleMutationsUseCase = contentScriptContainer.resolve(HandleMutationsUseCase);

  const observer = new MutationObserver((mutations) => {
    handleMutationsUseCase.exec(mutations);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
