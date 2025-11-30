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
 */
export class ApplyRulesOnDomMutationUseCase {
  private elements: Elements;
  private repository: IRewriteRuleRepository;
  private currentUrlService: ICurrentUrlService;
  private debounceTimer: IDebounceTimer;
  private isApplyingToRoot: boolean;

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
  }

  /**
   * MutationObserverからのmutationsを処理する
   */
  handleMutations(mutations: MutationRecord[]): void {
    // ルートへの適用中はスキップ（ページロード/ルール保存時との重複防止）
    if (this.isApplyingToRoot) {
      return;
    }

    const mutationRecords = new MutationRecords(mutations);
    this.elements.merge(mutationRecords.extractAddedElements());
    this.debounceTimer.scheduleWithGuard(() => this.applyRulesToMutatedElements(), DEBOUNCE_DELAY_MS);
  }

  /**
   * ページロード時またはルール保存時に、ルート要素全体にルールを適用する
   */
  async applyRulesToRoot(root: Element): Promise<void> {
    this.isApplyingToRoot = true;
    this.elements = new Elements();

    try {
      const rewriteRules = await this.fetchMatchingRules();
      rewriteRules.applyRulesWithDomDiffer(root);
    } finally {
      this.isApplyingToRoot = false;
    }
  }

  private async applyRulesToMutatedElements(): Promise<void> {
    // 適用直前にも再度チェック（デバウンス待ち中にapplyRulesToRootが実行された可能性）
    if (this.isApplyingToRoot) {
      return;
    }

    const attachedElements = this.elements.extractAttachedElements();
    const rewriteRules = await this.fetchMatchingRules();
    for (const element of attachedElements.toArray()) {
      rewriteRules.applyRulesWithDomDiffer(element);
    }
  }

  private async fetchMatchingRules() {
    const currentUrl = this.currentUrlService.getCurrentUrl();
    return await this.repository.getRulesMatchingUrl(currentUrl);
  }
}
