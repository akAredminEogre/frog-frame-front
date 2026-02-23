import { ExportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonErrorOutputData';
import { ExportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonOutputData';
import { IExportRulesJsonPresenter } from 'src/application-business-rules/ports/output/IExportRulesJsonPresenter';

/**
 * ルールJSONエクスポート結果のPresenter
 * OutputDataを受け取り、コールバック関数を呼び出してViewにエクスポート結果を通知する
 */
export class ExportRulesJsonPresenter implements IExportRulesJsonPresenter {
  constructor(
    private readonly triggerDownload: (jsonContent: string, fileName: string) => void,
    private readonly showErrorInView: (formattedMessage: string) => void
  ) {}

  /**
   * 成功時の出力を表示する
   * @param outputData 出力データ
   */
  present(outputData: ExportRulesJsonOutputData): void {
    this.triggerDownload(outputData.jsonContent, outputData.fileName);
  }

  /**
   * エラー時の出力を表示する
   * @param errorData エラーデータ
   */
  presentError(errorData: ExportRulesJsonErrorOutputData): void {
    const formattedMessage = `エクスポート処理中にエラーが発生しました: ${errorData.message}`;
    this.showErrorInView(formattedMessage);
  }
}
