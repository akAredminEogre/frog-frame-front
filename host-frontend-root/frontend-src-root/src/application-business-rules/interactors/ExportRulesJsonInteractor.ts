import { ExportRulesJsonInputData } from 'src/application-business-rules/dto/input/ExportRulesJsonInputData';
import { ExportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonErrorOutputData';
import { ExportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonOutputData';
import { RulesJsonFileSchema } from 'src/application-business-rules/dto/RulesJsonSchema';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IExportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IExportRulesJsonUseCase';
import { IExportRulesJsonPresenter } from 'src/application-business-rules/ports/output/IExportRulesJsonPresenter';

/**
 * ルールJSONエクスポートのInteractor
 * 全ルール取得→JSON構築→Presenter通知を実行
 */
export class ExportRulesJsonInteractor implements IExportRulesJsonUseCase {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly presenter: IExportRulesJsonPresenter
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  async execute(inputData: ExportRulesJsonInputData): Promise<void> {
    try {
      const rewriteRules = await this.repository.getAll();
      const rules = rewriteRules.toArray();

      const now = new Date();
      const exportedAt = this.formatLocalISO(now);
      const fileName = `frog-frame-front-rules-${this.formatLocalDateTime(now)}.json`;

      // RulesJsonFileSchema に型付けすることでインポート機能との整合性を保証する
      const exportData: RulesJsonFileSchema = {
        version: '1.0',
        exportedAt,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        rules: rules.map((rule) => ({
          id: rule.id,
          oldString: rule.oldString,
          newString: rule.newString,
          urlPattern: rule.urlPattern,
          isRegex: rule.isRegex,
          isActive: rule.isActive,
        })),
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const outputData = new ExportRulesJsonOutputData(jsonContent, fileName);
      this.presenter.present(outputData);
    } catch (error) {
      const errorData = new ExportRulesJsonErrorOutputData(error);
      this.presenter.presentError(errorData);
    }
  }

  /**
   * ISO 8601形式のローカルタイム文字列を生成（タイムゾーンオフセット付き）
   * 例: 2026-02-23T10:30:00+09:00
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private formatLocalISO(date: Date): string {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const minutes = String(Math.abs(offset) % 60).padStart(2, '0');

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${hours}:${minutes}`;
  }

  /**
   * ファイル名用のローカルタイム文字列を生成
   * 例: 20260223_103000
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private formatLocalDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}_${hour}${minute}${second}`;
  }
}
