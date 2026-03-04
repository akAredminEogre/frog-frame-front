import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { PreviewRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/PreviewRulesJsonPreviewOutputData';
import { IPreviewRulesJsonPresenter } from 'src/application-business-rules/ports/output/IPreviewRulesJsonPresenter';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ImportErrorCallback } from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';

/**
 * ルールJSONプレビュー結果のPresenter
 * PreviewData / ErrorOutputData を受け取り、コールバック関数でViewに通知する
 */
export class PreviewRulesJsonPresenter implements IPreviewRulesJsonPresenter {
  constructor(
    private readonly onPreview: (currentCount: number, importCount: number, validatedRules: RewriteRule[]) => void,
    private readonly showErrorInView: ImportErrorCallback
  ) {}

  presentPreview(preview: PreviewRulesJsonPreviewOutputData): void {
    this.onPreview(preview.currentRuleCount, preview.importRuleCount, preview.validatedRules);
  }

  presentError(errorData: ImportRulesJsonErrorOutputData): void {
    this.showErrorInView(errorData.message);
  }
}
