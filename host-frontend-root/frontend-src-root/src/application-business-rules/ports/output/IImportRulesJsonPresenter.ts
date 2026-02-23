import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { ImportRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonPreviewOutputData';

/**
 * ルールJSONインポート結果のOutput Port（Presenterインターフェース）
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン準拠
 * 3コールバック構成（エクスポートの2コールバックにプレビュー用を追加）
 */
export interface IImportRulesJsonPresenter {
  presentPreview(preview: ImportRulesJsonPreviewOutputData): void;
  present(output: ImportRulesJsonOutputData): void;
  presentError(error: ImportRulesJsonErrorOutputData): void;
}
