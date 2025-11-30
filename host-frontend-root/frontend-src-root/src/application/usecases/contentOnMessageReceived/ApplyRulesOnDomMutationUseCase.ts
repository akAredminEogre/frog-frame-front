import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { IRuleApplicationGuard } from 'src/application/ports/IRuleApplicationGuard';
import { Elements } from 'src/domain/value-objects/Elements/Elements';
import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

const DEBOUNCE_DELAY_MS = 100;

/**
 * Content Script用UseCase - DOM Mutation監視時のルール適用
 *
 * MutationObserverからのmutationsを受け取り、デバウンスしながらルールを適用する
 * Lazy load等で遅れてくるDOM更新に対応する
 */
export class ApplyRulesOnDomMutationUseCase {
  private elements: Elements;
  private repository: IRewriteRuleRepository;
  private currentUrlService: ICurrentUrlService;
  private debounceTimer: IDebounceTimer;
  private ruleApplicationGuard: IRuleApplicationGuard;

  constructor(
    repository: IRewriteRuleRepository,
    currentUrlService: ICurrentUrlService,
    debounceTimer: IDebounceTimer,
    ruleApplicationGuard: IRuleApplicationGuard
  ) {
    this.repository = repository;
    this.currentUrlService = currentUrlService;
    this.debounceTimer = debounceTimer;
    this.ruleApplicationGuard = ruleApplicationGuard;
    this.elements = new Elements();
  }

  /**
   * MutationObserverからのmutationsを処理する
   */
  handleMutations(mutations: MutationRecord[]): void {
    // applyAllRulesがペンディング要素のクリアを要求している場合はクリア
    if (this.ruleApplicationGuard.shouldClearPending()) {
      this.elements = new Elements();
      return;
    }

    // 既にルール適用中の場合はスキップ（applyAllRulesとの重複防止）
    if (this.ruleApplicationGuard.isApplicationInProgress()) {
      return;
    }

    const mutationRecords = new MutationRecords(mutations);
    this.elements.merge(mutationRecords.extractAddedElements());
    this.debounceTimer.scheduleWithGuard(() => this.applyRules(), DEBOUNCE_DELAY_MS);
  }

  private async applyRules(): Promise<void> {
    // 適用直前にも再度チェック（デバウンス待ち中にapplyAllRulesが実行された可能性）
    if (this.ruleApplicationGuard.isApplicationInProgress()) {
      return;
    }

    const attachedElements = this.elements.extractAttachedElements();
    const currentUrl = this.currentUrlService.getCurrentUrl();
    const rewriteRules = await this.repository.getRulesMatchingUrl(currentUrl);
    for (const element of attachedElements.toArray()) {
      rewriteRules.applyRulesWithDomDiffer(element);
    }
  }
}
