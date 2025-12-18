import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveOutputData';

/**
 * ルールの有効/無効切り替え結果を表示するためのOutput Port
 */
export interface IToggleRuleActivePresenter {
  /**
   * 成功時の出力を表示する
   * @param outputData 出力データ
   */
  presentSuccess(outputData: ToggleRuleActiveOutputData): void;

  /**
   * 失敗時の出力を表示する
   * @param error エラー情報
   */
  presentError(error: Error): void;
}
