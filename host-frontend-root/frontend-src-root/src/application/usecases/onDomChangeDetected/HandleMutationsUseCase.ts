import { inject, injectable } from 'tsyringe';

import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { PendingNodes } from 'src/domain/value-objects/PendingNodes/PendingNodes';

const DEBOUNCE_DELAY_MS = 100;

/**
 * MutationObserverからのmutationを処理するユースケース
 * ルール適用中でなければノードを収集し、ルール適用をスケジュールする
 */
export
@injectable()
class HandleMutationsUseCase {
  private pendingNodes: PendingNodes;
  private isApplyingRules: boolean;

  constructor(
    @inject('IRewriteRuleRepository') private repository: IRewriteRuleRepository,
    @inject('ICurrentTabService') private currentTabService: ICurrentTabService,
    @inject('IDebounceTimer') private debounceTimer: IDebounceTimer
  ) {
    this.pendingNodes = new PendingNodes();
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

    this.pendingNodes.collectFromMutations(mutations);
    this.debounceTimer.schedule(() => {
      this.applyRulesToPendingNodes();
    }, DEBOUNCE_DELAY_MS);
  }

  private async applyRulesToPendingNodes(): Promise<void> {
    if (!this.pendingNodes.hasNodes()) {
      return;
    }

    const nodesToProcess = this.pendingNodes.extractAll();

    this.isApplyingRules = true;

    try {
      const currentTab = await this.currentTabService.getCurrentTab();
      const applySavedRulesUseCase = new ApplySavedRulesOnPageLoadUseCase(this.repository);

      for (const node of nodesToProcess) {
        if (document.body.contains(node)) {
          await applySavedRulesUseCase.applyAllRules(node, currentTab.getTabUrl().value);
        }
      }
    } finally {
      this.isApplyingRules = false;
    }
  }
}
