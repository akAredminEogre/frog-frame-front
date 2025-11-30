import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { Elements } from 'src/domain/value-objects/Elements/Elements';
import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

const DEBOUNCE_DELAY_MS = 100;

/**
 * Content Script用UseCase - DOM Mutation監視時のルール適用
 *
 * MutationObserverからのmutationsを受け取り、デバウンスしながらルールを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 * ページロード時のルール適用も担当する（applyRulesToRoot）
 *
 * 状態管理:
 * - hasInitialLoadCompleted: 初回applyRulesToRoot完了後にtrue
 *   → 初回ロード完了前はMutationObserverによるルール適用を抑制
 * - isApplyingToRoot: applyRulesToRoot実行中にtrue
 *   → 実行中のMutationによる重複適用を防止
 */
export class ApplyRulesOnDomMutationUseCase {
  private elements: Elements;
  private repository: IRewriteRuleRepository;
  private currentUrlService: ICurrentUrlService;
  private debounceTimer: IDebounceTimer;
  private isApplyingToRoot: boolean;
  private hasInitialLoadCompleted: boolean;

  constructor(
    repository: IRewriteRuleRepository,
    currentUrlService: ICurrentUrlService,
    debounceTimer: IDebounceTimer
  ) {
    this.repository = repository;
    this.currentUrlService = currentUrlService;
    this.debounceTimer = debounceTimer;
    this.elements = new Elements();
    this.isApplyingToRoot = false;
    this.hasInitialLoadCompleted = false;
  }

  /**
   * MutationObserverからのmutationsを処理する
   *
   * 初回ページロード完了前は要素の蓄積のみ行い、ルール適用はスケジュールしない
   * これにより、ページロード中にMutationObserverが連鎖的にルール適用を
   * 引き起こし、ページロードが完了しない問題を防止する
   */
  handleMutations(mutations: MutationRecord[]): void {
    // ルートへの適用中はスキップ（ページロード/ルール保存時との重複防止）
    if (this.isApplyingToRoot) {
      return;
    }

    // 初回ロード完了前は蓄積しない（applyRulesToRootでdocument.body全体を処理するため）
    if (!this.hasInitialLoadCompleted) {
      return;
    }

    const mutationRecords = new MutationRecords(mutations);
    this.elements.merge(mutationRecords.extractAddedElements());
    this.debounceTimer.scheduleWithGuard(() => this.applyRulesToMutatedElements(), DEBOUNCE_DELAY_MS);
  }

  /**
   * ページロード時またはルール保存時に、ルート要素全体にルールを適用する
   *
   * 初回呼び出し完了後、hasInitialLoadCompletedをtrueに設定し、
   * 以降のMutationObserverによるルール適用を許可する
   *
   * 重要: applyRulesWithDomDifferによるDOM変更がMutationObserverをトリガーするが、
   * そのコールバックはマイクロタスクとしてスケジュールされる。
   * setTimeout(0)でマクロタスクを待つことで、MutationObserverコールバックが
   * isApplyingToRoot=true の状態で処理されることを保証する。
   */
  async applyRulesToRoot(root: Element): Promise<void> {
    this.isApplyingToRoot = true;
    this.elements = new Elements();

    try {
      const rewriteRules = await this.fetchMatchingRules();
      rewriteRules.applyRulesWithDomDiffer(root);

      // MutationObserverコールバック（マイクロタスク）が処理されるのを待つ
      // これにより、DOM変更で発火したMutationがisApplyingToRoot=trueの間に処理される
      await new Promise((resolve) => setTimeout(resolve, 0));
    } finally {
      this.isApplyingToRoot = false;
      this.hasInitialLoadCompleted = true;
    }
  }

  private async applyRulesToMutatedElements(): Promise<void> {
    // 適用直前にも再度チェック（デバウンス待ち中にapplyRulesToRootが実行された可能性）
    if (this.isApplyingToRoot) {
      return;
    }

    // ルール適用中フラグを立てて、DOM変更によるMutationObserverの再トリガーを防ぐ
    this.isApplyingToRoot = true;

    try {
      const attachedElements = this.elements.extractAttachedElements();
      const rewriteRules = await this.fetchMatchingRules();
      for (const element of attachedElements.toArray()) {
        rewriteRules.applyRulesWithDomDiffer(element);
      }

      // MutationObserverコールバック（マイクロタスク）が処理されるのを待つ
      await new Promise((resolve) => setTimeout(resolve, 0));
    } finally {
      this.isApplyingToRoot = false;
    }
  }

  private async fetchMatchingRules() {
    const currentUrl = this.currentUrlService.getCurrentUrl();
    return await this.repository.getRulesMatchingUrl(currentUrl);
  }
}
