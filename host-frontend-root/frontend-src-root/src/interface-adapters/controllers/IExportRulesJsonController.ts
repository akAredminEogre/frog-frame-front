/**
 * ルールJSONエクスポートControllerのインターフェース
 */
export interface IExportRulesJsonController {
  exportRulesJson(): Promise<void>;
}
