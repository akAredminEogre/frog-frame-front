import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';

/**
 * ルールの有効/無効を切り替えるユースケースのInput Port
 */
export interface IToggleRuleActiveUseCase {
  /**
   * ルールの有効/無効を切り替える
   * @param inputData 入力データ
   */
  execute(inputData: ToggleRuleActiveInputData): Promise<void>;
}
