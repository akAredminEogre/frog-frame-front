import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';

/**
 * ルールJSONインポートのユースケースInput Port
 */
export interface IImportRulesJsonUseCase {
  /**
   * ルールをJSONファイルからインポートする
   * @param inputData 入力データ
   */
  importRulesJson(inputData: ImportRulesJsonInputData): Promise<void>;
}
