import { inject, injectable } from 'tsyringe';

import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { CollectAddedNodesUseCase } from 'src/application/usecases/onDomChangeDetected/CollectAddedNodesUseCase';
import { ScheduleRuleApplicationUseCase } from 'src/application/usecases/onDomChangeDetected/ScheduleRuleApplicationUseCase';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';

/**
 * MutationObserverからのmutationを処理するユースケース
 * ルール適用中でなければノードを収集し、ルール適用をスケジュールする
 */
export
@injectable()
class HandleMutationsUseCase {
  private pendingNodes: Set<Element>;
  private isApplyingRules: boolean;
  private collectAddedNodesUseCase: CollectAddedNodesUseCase;
  private scheduleRuleApplicationUseCase: ScheduleRuleApplicationUseCase;

  constructor(
    @inject('IRewriteRuleRepository') private repository: IRewriteRuleRepository,
    @inject('ICurrentTabService') private currentTabService: ICurrentTabService,
    @inject('IDebounceTimer') debounceTimer: IDebounceTimer
  ) {
    this.pendingNodes = new Set();
    this.isApplyingRules = false;
    this.collectAddedNodesUseCase = new CollectAddedNodesUseCase(this.pendingNodes);
    this.scheduleRuleApplicationUseCase = new ScheduleRuleApplicationUseCase(
      debounceTimer,
      this.applyRulesToPendingNodes.bind(this)
    );
  }

  /**
   * MutationRecordを処理する
   * @param mutations MutationObserverから渡されるMutationRecord配列
   */
  exec(mutations: MutationRecord[]): void {
    if (this.isApplyingRules) {
      return;
    }

    this.collectAddedNodesUseCase.exec(mutations);
    this.scheduleRuleApplicationUseCase.exec();
  }

  private async applyRulesToPendingNodes(): Promise<void> {
    if (this.pendingNodes.size === 0) {
      return;
    }

    const nodesToProcess = Array.from(this.pendingNodes);
    this.pendingNodes.clear();

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
