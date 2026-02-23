import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { ImportRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonPreviewOutputData';
import { IImportRulesJsonPresenter } from 'src/application-business-rules/ports/output/IImportRulesJsonPresenter';
import {
  ImportErrorCallback,
  ImportPreviewCallback,
  ImportSuccessCallback,
} from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';

/**
 * ルールJSONインポート結果のPresenter
 * PreviewData / OutputData / ErrorOutputData を受け取り、
 * コールバック関数を呼び出してViewにインポート結果を通知する
 */
export class ImportRulesJsonPresenter implements IImportRulesJsonPresenter {
  constructor(
    private readonly onPreview: ImportPreviewCallback,
    private readonly onSuccess: ImportSuccessCallback,
    private readonly showErrorInView: ImportErrorCallback
  ) {}

  presentPreview(preview: ImportRulesJsonPreviewOutputData): void {
    this.onPreview(preview.currentRuleCount, preview.importRuleCount);
  }

  present(output: ImportRulesJsonOutputData): void {
    const message = `${output.importedCount}件のルールをインポートしました`;
    this.onSuccess(message);
  }

  presentError(errorData: ImportRulesJsonErrorOutputData): void {
    this.showErrorInView(errorData.message);
  }
}
