import { ExportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonErrorOutputData';
import { ExportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonOutputData';

/**
 * ルールJSONエクスポート結果を表示するためのOutput Port
 */
export interface IExportRulesJsonPresenter {
  /**
   * 成功時の出力を表示する
   * @param outputData 出力データ
   */
  present(outputData: ExportRulesJsonOutputData): void;

  /**
   * エラー時の出力を表示する
   * @param errorData エラーデータ
   */
  presentError(errorData: ExportRulesJsonErrorOutputData): void;
}
