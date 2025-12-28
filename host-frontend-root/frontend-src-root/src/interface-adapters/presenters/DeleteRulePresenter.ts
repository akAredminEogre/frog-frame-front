import { DeleteRuleErrorOutputData } from 'src/application-business-rules/dto/output/DeleteRuleErrorOutputData';
import { DeleteRuleOutputData } from 'src/application-business-rules/dto/output/DeleteRuleOutputData';
import { IDeleteRulePresenter } from 'src/application-business-rules/ports/output/IDeleteRulePresenter';

/**
 * ルール削除結果のPresenter
 * OutputDataを受け取り、コールバック関数を呼び出してViewに削除結果を通知する
 */
export class DeleteRulePresenter implements IDeleteRulePresenter {
  constructor(
    private readonly removeRuleFromView: (ruleId: number) => void,
    private readonly showErrorInView: (ruleId: number, message: string) => void
  ) {}

  /**
   * 成功時の出力を表示する
   * @param outputData 出力データ
   */
  present(outputData: DeleteRuleOutputData): void {
    this.removeRuleFromView(outputData.deletedRuleId);
  }

  /**
   * エラー時の出力を表示する
   * @param errorData エラーデータ
   */
  presentError(errorData: DeleteRuleErrorOutputData): void {
    this.showErrorInView(errorData.ruleId, errorData.message);
  }
}
