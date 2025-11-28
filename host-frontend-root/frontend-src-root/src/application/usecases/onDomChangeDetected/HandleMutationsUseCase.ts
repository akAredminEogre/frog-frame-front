import { CollectAddedNodesUseCase } from 'src/application/usecases/onDomChangeDetected/CollectAddedNodesUseCase';
import { ScheduleRuleApplicationUseCase } from 'src/application/usecases/onDomChangeDetected/ScheduleRuleApplicationUseCase';

/**
 * MutationObserverからのmutationを処理するユースケース
 * ルール適用中でなければノードを収集し、ルール適用をスケジュールする
 */
export class HandleMutationsUseCase {
  private collectAddedNodesUseCase: CollectAddedNodesUseCase;
  private scheduleRuleApplicationUseCase: ScheduleRuleApplicationUseCase;

  constructor(
    collectAddedNodesUseCase: CollectAddedNodesUseCase,
    scheduleRuleApplicationUseCase: ScheduleRuleApplicationUseCase
  ) {
    this.collectAddedNodesUseCase = collectAddedNodesUseCase;
    this.scheduleRuleApplicationUseCase = scheduleRuleApplicationUseCase;
  }

  /**
   * MutationRecordを処理する
   * @param mutations MutationObserverから渡されるMutationRecord配列
   * @param isApplyingRules ルール適用中かどうかを返す関数
   */
  exec(mutations: MutationRecord[], isApplyingRules: () => boolean): void {
    if (isApplyingRules()) {
      return;
    }

    this.collectAddedNodesUseCase.exec(mutations);
    this.scheduleRuleApplicationUseCase.exec();
  }
}
