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
 */
export class ApplyRulesOnDomMutationUseCase {
  private elements: Elements;
  private repository: IRewriteRuleRepository;
  private currentUrlService: ICurrentUrlService;
  private debounceTimer: IDebounceTimer;

  constructor(
    repository: IRewriteRuleRepository,
    currentUrlService: ICurrentUrlService,
    debounceTimer: IDebounceTimer
  ) {
    this.repository = repository;
    this.currentUrlService = currentUrlService;
    this.debounceTimer = debounceTimer;
    this.elements = new Elements();
  }

  /**
   * MutationObserverからのmutationsを処理する
   */
  handleMutations(mutations: MutationRecord[]): void {
    const mutationRecords = new MutationRecords(mutations);
    this.elements.merge(mutationRecords.extractAddedElements());
    this.debounceTimer.scheduleWithGuard(() => this.applyRules(), DEBOUNCE_DELAY_MS);
  }

  private async applyRules(): Promise<void> {
    const attachedElements = this.elements.extractAttachedElements();
    await attachedElements.applyRules(this.repository, this.currentUrlService);
  }
}
