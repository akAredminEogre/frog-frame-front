import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { IConfirmImportPresenter } from 'src/application-business-rules/ports/output/IConfirmImportPresenter';
import {
  ImportErrorCallback,
  ImportSuccessCallback,
} from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';

/**
 * インポート確定結果のPresenter
 * OutputData / ErrorOutputData を受け取り、コールバック関数を呼び出してViewに結果を通知する
 */
export class ConfirmImportPresenter implements IConfirmImportPresenter {
  constructor(
    private readonly onSuccess: ImportSuccessCallback,
    private readonly showErrorInView: ImportErrorCallback
  ) {}

  present(output: ImportRulesJsonOutputData): void {
    const message = `${output.importedCount}件のルールをインポートしました`;
    this.onSuccess(message);
  }

  presentError(errorData: ImportRulesJsonErrorOutputData): void {
    this.showErrorInView(errorData.message);
  }
}
