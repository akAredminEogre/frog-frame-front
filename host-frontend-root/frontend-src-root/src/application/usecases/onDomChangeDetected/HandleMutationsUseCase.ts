import { inject, injectable } from 'tsyringe';

import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { Elements } from 'src/domain/value-objects/Elements/Elements';
import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

const DEBOUNCE_DELAY_MS = 100;

/**
 * MutationObserverからのmutationを処理するユースケース
 * ルール適用中でなければノードを収集し、ルール適用をスケジュールする
 */
export
@injectable()
class HandleMutationsUseCase {
  private elements: Elements;
  private isApplyingRules: boolean;

  constructor(
    @inject('IRewriteRuleRepository') private repository: IRewriteRuleRepository,
    @inject('ICurrentTabService') private currentTabService: ICurrentTabService,
    @inject('IDebounceTimer') private debounceTimer: IDebounceTimer
  ) {
    this.elements = new Elements();
    this.isApplyingRules = false;
  }

  /**
   * MutationRecordを処理する
   * @param mutations MutationObserverから渡されるMutationRecord配列
   */
  exec(mutations: MutationRecord[]): void {
    if (this.isApplyingRules) {
      return;
    }

    const mutationRecords = new MutationRecords(mutations);
    this.elements.collectFromMutations(mutationRecords);
    this.debounceTimer.schedule(() => {
      this.applyRulesToElements();
    }, DEBOUNCE_DELAY_MS);
  }

  private async applyRulesToElements(): Promise<void> {
    if (!this.elements.hasElements()) {
      return;
    }

    const elementsToProcess = this.elements.extractAll();

    this.isApplyingRules = true;

    try {
      const currentTab = await this.currentTabService.getCurrentTab();
      const applySavedRulesUseCase = new ApplySavedRulesOnPageLoadUseCase(this.repository);

      for (const element of elementsToProcess) {
        if (document.body.contains(element)) {
          await applySavedRulesUseCase.applyAllRules(element, currentTab.getTabUrl().value);
        }
      }
    } finally {
      this.isApplyingRules = false;
    }
  }
}
