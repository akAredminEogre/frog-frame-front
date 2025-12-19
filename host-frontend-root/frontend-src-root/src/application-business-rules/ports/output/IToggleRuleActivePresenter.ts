import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveOutputData';

/**
 * ルールの有効/無効切り替え結果を表示するためのOutput Port
 */
export interface IToggleRuleActivePresenter {
  /**
   * 出力を表示する
   * @param outputData 出力データ
   */
  present(outputData: ToggleRuleActiveOutputData): void;
}
