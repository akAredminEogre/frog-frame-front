import { PreviewRulesJsonInputData } from 'src/application-business-rules/dto/input/PreviewRulesJsonInputData';

/**
 * ルールJSONプレビューのInput Port（UseCase インターフェース）
 * Phase 1のみを担当: ファイル読み取り → バリデーション → Presenter.presentPreview()
 */
export interface IPreviewRulesJsonUseCase {
  previewRulesJson(inputData: PreviewRulesJsonInputData): Promise<void>;
}
