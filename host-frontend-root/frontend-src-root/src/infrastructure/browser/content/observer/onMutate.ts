import { ApplyRulesOnPageLoadUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase';
import { Elements } from 'src/domain/value-objects/Elements/Elements';
import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';

const DEBOUNCE_DELAY_MS = 100;

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
  // 手動DI解決
  const repository = new ChromeRuntimeRewriteRuleRepository();
  const currentUrlService = new WindowCurrentUrlService();
  const debounceTimer = new DebounceTimer();

  const elements = new Elements();

  const applyRulesToElements = async () => {
    const applyRulesUseCase = new ApplyRulesOnPageLoadUseCase(repository, currentUrlService);
    const attachedElements = elements.extractAttachedElements();
    for (const element of attachedElements) {
      await applyRulesUseCase.exec(element);
    }
  };

  const observer = new MutationObserver((mutations) => {
    const mutationRecords = new MutationRecords(mutations);
    elements.merge(mutationRecords.extractAddedElements());
    debounceTimer.scheduleWithGuard(applyRulesToElements, DEBOUNCE_DELAY_MS);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
