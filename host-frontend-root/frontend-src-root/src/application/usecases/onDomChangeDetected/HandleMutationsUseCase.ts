import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { CollectAddedNodesUseCase } from 'src/application/usecases/onDomChangeDetected/CollectAddedNodesUseCase';
import { ScheduleRuleApplicationUseCase } from 'src/application/usecases/onDomChangeDetected/ScheduleRuleApplicationUseCase';
import { ApplyRulesToMutatedNodesUseCase } from 'src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase';

type RepositoryFactory = () => IRewriteRuleRepository;
type CurrentTabServiceFactory = () => ICurrentTabService;

/**
 * MutationObserverからのmutationを処理するユースケース
 * ルール適用中でなければノードを収集し、ルール適用をスケジュールする
 */
export class HandleMutationsUseCase {
  private repositoryFactory: RepositoryFactory;
  private currentTabServiceFactory: CurrentTabServiceFactory;
  private pendingNodes: Set<Element>;
  private isApplyingRules: boolean;
  private collectAddedNodesUseCase: CollectAddedNodesUseCase;
  private scheduleRuleApplicationUseCase: ScheduleRuleApplicationUseCase;

  constructor(repositoryFactory: RepositoryFactory, currentTabServiceFactory: CurrentTabServiceFactory) {
    this.repositoryFactory = repositoryFactory;
    this.currentTabServiceFactory = currentTabServiceFactory;
    this.pendingNodes = new Set();
    this.isApplyingRules = false;
    this.collectAddedNodesUseCase = new CollectAddedNodesUseCase(this.pendingNodes);
    this.scheduleRuleApplicationUseCase = new ScheduleRuleApplicationUseCase(
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
      const repository = this.repositoryFactory();
      const currentTabService = this.currentTabServiceFactory();
      const useCase = new ApplyRulesToMutatedNodesUseCase(repository, currentTabService);
      await useCase.applyRules(nodesToProcess, (node) => document.body.contains(node));
    } finally {
      this.isApplyingRules = false;
    }
  }
}
