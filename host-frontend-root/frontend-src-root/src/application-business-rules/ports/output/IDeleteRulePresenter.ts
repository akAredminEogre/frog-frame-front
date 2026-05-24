import { DeleteRuleErrorOutputData } from 'src/application-business-rules/dto/output/DeleteRuleErrorOutputData';
import { DeleteRuleOutputData } from 'src/application-business-rules/dto/output/DeleteRuleOutputData';

/**
 * ルール削除結果を表示するためのOutput Port
 */
export interface IDeleteRulePresenter {
  /**
   * 成功時の出力を表示する
   * @param outputData 出力データ
   */
  present(outputData: DeleteRuleOutputData): void;

  /**
   * エラー時の出力を表示する
   * @param errorData エラーデータ
   */
  presentError(errorData: DeleteRuleErrorOutputData): void;
}
