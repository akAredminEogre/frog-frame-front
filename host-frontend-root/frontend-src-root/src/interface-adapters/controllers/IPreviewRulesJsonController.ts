/**
 * ルールJSONプレビューのControllerインターフェース
 */
export interface IPreviewRulesJsonController {
  previewRulesJson(file: File): Promise<void>;
}
