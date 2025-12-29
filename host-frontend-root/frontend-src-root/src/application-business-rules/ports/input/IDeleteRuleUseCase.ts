import { DeleteRuleInputData } from 'src/application-business-rules/dto/input/DeleteRuleInputData';

/**
 * ルールを削除するユースケースのInput Port
 */
export interface IDeleteRuleUseCase {
  /**
   * ルールを削除する
   * @param inputData 入力データ
   */
  execute(inputData: DeleteRuleInputData): Promise<void>;
}
