import { ExportRulesJsonInputData } from 'src/application-business-rules/dto/input/ExportRulesJsonInputData';

/**
 * ルールJSONエクスポートのユースケースInput Port
 */
export interface IExportRulesJsonUseCase {
  /**
   * ルールをJSON形式でエクスポートする
   * @param inputData 入力データ
   */
  execute(inputData: ExportRulesJsonInputData): Promise<void>;
}
