import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';

/**
 * DOM MutationObserverを管理するサービス
 * Lazy load等で遅れてくるDOM更新を検知してrewrite rulesを適用する
 */
export class DomMutationObserverService {
  private observer: MutationObserver;
  private isApplyingRules: boolean;
  private pendingNodes: Set<Element>;
  private debounceTimer: number | null;
  private currentUrl: string;

  private static readonly DEBOUNCE_DELAY_MS = 100;

  constructor(currentUrl: string) {
    this.currentUrl = currentUrl;
    this.isApplyingRules = false;
    this.pendingNodes = new Set();
    this.debounceTimer = null;
    this.observer = this.createObserver();
  }

  /**
   * MutationObserverを作成する
   */
  private createObserver(): MutationObserver {
    return new MutationObserver((mutations) => {
      this.handleMutations(mutations);
    });
  }

  /**
   * DOM監視を開始する
   */
  public startObserving(): void {
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Mutationイベントを処理する
   */
  private handleMutations(mutations: MutationRecord[]): void {
    if (this.isApplyingRules) {
      return;
    }

    this.collectAddedNodes(mutations);
    this.scheduleRuleApplication();
  }

  /**
   * 追加されたノードを収集する
   */
  private collectAddedNodes(mutations: MutationRecord[]): void {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          this.pendingNodes.add(node);
        }
      });
    });
  }

  /**
   * ルール適用をスケジュールする（デバウンス処理）
   */
  private scheduleRuleApplication(): void {
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.applyRulesToPendingNodes();
    }, DomMutationObserverService.DEBOUNCE_DELAY_MS);
  }

  /**
   * 保留中のノードにルールを適用する
   */
  private async applyRulesToPendingNodes(): Promise<void> {
    if (this.pendingNodes.size === 0) {
      return;
    }

    const nodesToProcess = Array.from(this.pendingNodes);
    this.pendingNodes.clear();
    this.debounceTimer = null;

    this.isApplyingRules = true;

    try {
      const rewriteRuleRepository = new ChromeRuntimeRewriteRuleRepository();
      const useCase = new ApplySavedRulesOnPageLoadUseCase(rewriteRuleRepository);

      for (const node of nodesToProcess) {
        if (document.body.contains(node)) {
          await useCase.applyAllRules(node, this.currentUrl);
        }
      }
    } finally {
      this.isApplyingRules = false;
    }
  }
}
