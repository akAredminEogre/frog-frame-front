import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * Content Script用のMutationObserverを登録し、DOM更新を監視してrewrite rulesを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 *
 * 手動DI解決: tsyringeのデコレーターメタデータ問題を回避するため
 * Content Scriptではデコレーターが正しく動作しないので、依存関係を明示的にインスタンス化
 */
export function observerOnMutate() {
  const repository = new ChromeRuntimeRewriteRuleRepository();
  const currentUrlService = new WindowCurrentUrlService();
  const debounceTimer = new DebounceTimer();
  const useCase = new ApplyRulesOnDomMutationUseCase(repository, currentUrlService, debounceTimer);

  const observer = new MutationObserver((mutations) => useCase.handleMutations(mutations));
  observer.observe(document.body, { childList: true, subtree: true });
}
