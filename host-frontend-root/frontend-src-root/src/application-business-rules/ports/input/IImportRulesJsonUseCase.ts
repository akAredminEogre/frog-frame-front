import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';

/**
 * ルールJSONインポートのInput Port（UseCase インターフェース）
 * 2フェーズ制御フロー:
 *   Phase 1: importRulesJson() → バリデーション → Presenter.presentPreview()
 *   Phase 2: confirmImport() → 全件削除 → 新規作成 → Presenter.present()
 */
export interface IImportRulesJsonUseCase {
  importRulesJson(inputData: ImportRulesJsonInputData): Promise<void>;
  confirmImport(): Promise<void>;
}
