/**
 * ルールJSONインポートのControllerインターフェース
 * ADR-005: Factoryの戻り値型として使用
 */
export interface IImportRulesJsonController {
  importRulesJson(file: File): Promise<void>;
  confirmImport(): Promise<void>;
}
