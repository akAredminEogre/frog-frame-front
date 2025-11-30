import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { IObserverControl } from 'src/application/ports/IObserverControl';
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
 *
 * MutationObserver制御:
 * - IObserverControlを使用してルール適用中はMutationObserverを一時停止
 * - これにより、DOM変更がMutationObserverをトリガーし重複適用を引き起こすのを防ぐ
 */
export class ApplyRulesOnDomMutationUseCase {
  private elements: Elements;
  private repository: IRewriteRuleRepository;
  private currentUrlService: ICurrentUrlService;
  private debounceTimer: IDebounceTimer;
  private observerControl: IObserverControl;
  private hasInitialLoadCompleted: boolean;
  private isApplyingToRoot: boolean;

  constructor(
    repository: IRewriteRuleRepository,
    currentUrlService: ICurrentUrlService,
    debounceTimer: IDebounceTimer,
    observerControl: IObserverControl
  ) {
    this.repository = repository;
    this.currentUrlService = currentUrlService;
    this.debounceTimer = debounceTimer;
    this.observerControl = observerControl;
    this.elements = new Elements();
    this.hasInitialLoadCompleted = false;
    this.isApplyingToRoot = false;
  }

  /**
   * MutationObserverからのmutationsを処理する
   *
   * 初回ページロード完了前は要素の蓄積のみ行い、ルール適用はスケジュールしない
   * これにより、ページロード中にMutationObserverが連鎖的にルール適用を
   * 引き起こし、ページロードが完了しない問題を防止する
   */
  handleMutations(mutations: MutationRecord[]): void {
    console.log('[DEBUG] handleMutations: called with', mutations.length, 'mutations');
    console.log('[DEBUG] handleMutations: isApplyingToRoot=', this.isApplyingToRoot, 'hasInitialLoadCompleted=', this.hasInitialLoadCompleted);
    // ルートへの適用中はスキップ（ページロード/ルール保存時との重複防止）
    if (this.isApplyingToRoot) {
      console.log('[DEBUG] handleMutations: SKIPPED (isApplyingToRoot=true)');
      return;
    }

    // 初回ロード完了前は蓄積しない（applyRulesToRootでdocument.body全体を処理するため）
    if (!this.hasInitialLoadCompleted) {
      console.log('[DEBUG] handleMutations: SKIPPED (hasInitialLoadCompleted=false)');
      return;
    }

    const mutationRecords = new MutationRecords(mutations);
    this.elements.merge(mutationRecords.extractAddedElements());
    console.log('[DEBUG] handleMutations: scheduling debounce');
    this.debounceTimer.scheduleWithGuard(() => this.applyRulesToMutatedElements(), DEBOUNCE_DELAY_MS);
  }

  /**
   * ページロード時またはルール保存時に、ルート要素全体にルールを適用する
   *
   * 初回呼び出し完了後、hasInitialLoadCompletedをtrueに設定し、
   * 以降のMutationObserverによるルール適用を許可する
   *
   * 注意: 呼び出し元（applyAllRulesHandler）がMutationObserverを
   * disconnect/reconnectすることで、ルール適用中のDOM変更による
   * 重複適用を防止している
   */
  async applyRulesToRoot(root: Element): Promise<void> {
    console.log('[DEBUG] applyRulesToRoot: START');
    this.isApplyingToRoot = true;
    this.elements = new Elements();

    try {
      console.log('[DEBUG] applyRulesToRoot: fetching rules');
      const rewriteRules = await this.fetchMatchingRules();
      console.log('[DEBUG] applyRulesToRoot: applying rules with DomDiffer');
      rewriteRules.applyRulesWithDomDiffer(root);
      console.log('[DEBUG] applyRulesToRoot: rules applied');
    } finally {
      this.isApplyingToRoot = false;
      this.hasInitialLoadCompleted = true;
      console.log('[DEBUG] applyRulesToRoot: END (isApplyingToRoot=false, hasInitialLoadCompleted=true)');
    }
  }

  private async applyRulesToMutatedElements(): Promise<void> {
    console.log('[DEBUG] applyRulesToMutatedElements: START');
    // 適用直前にも再度チェック（デバウンス待ち中にapplyRulesToRootが実行された可能性）
    if (this.isApplyingToRoot) {
      console.log('[DEBUG] applyRulesToMutatedElements: SKIPPED (isApplyingToRoot=true)');
      return;
    }

    this.isApplyingToRoot = true;
    console.log('[DEBUG] applyRulesToMutatedElements: calling observerControl.disconnect');
    this.observerControl.disconnect();
    console.log('[DEBUG] applyRulesToMutatedElements: observerControl.disconnect done');

    try {
      const attachedElements = this.elements.extractAttachedElements();
      console.log('[DEBUG] applyRulesToMutatedElements: processing', attachedElements.toArray().length, 'elements');
      const rewriteRules = await this.fetchMatchingRules();
      for (const element of attachedElements.toArray()) {
        rewriteRules.applyRulesWithDomDiffer(element);
      }
      console.log('[DEBUG] applyRulesToMutatedElements: rules applied');
    } finally {
      console.log('[DEBUG] applyRulesToMutatedElements: calling observerControl.reconnect');
      this.observerControl.reconnect();
      this.isApplyingToRoot = false;
      console.log('[DEBUG] applyRulesToMutatedElements: END');
    }
  }

  private async fetchMatchingRules() {
    const currentUrl = this.currentUrlService.getCurrentUrl();
    return await this.repository.getRulesMatchingUrl(currentUrl);
  }
}
