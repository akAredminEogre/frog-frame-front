import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { PreviewRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/PreviewRulesJsonPreviewOutputData';

/**
 * ルールJSONプレビュー結果のOutput Port（Presenterインターフェース）
 * Preview Phase専用: presentPreview / presentError の2メソッド構成
 */
export interface IPreviewRulesJsonPresenter {
  presentPreview(preview: PreviewRulesJsonPreviewOutputData): void;
  presentError(error: ImportRulesJsonErrorOutputData): void;
}
