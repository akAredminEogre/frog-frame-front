import { IExportRulesJsonController } from 'src/interface-adapters/controllers/IExportRulesJsonController';

export type ExportSuccessCallback = (jsonContent: string, fileName: string) => void;
export type ExportErrorCallback = (formattedMessage: string) => void;

/**
 * ExportRulesJsonControllerを生成するFactoryのインターフェース
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export interface IExportRulesJsonControllerFactory {
  create(
    onSuccess: ExportSuccessCallback,
    onError: ExportErrorCallback
  ): IExportRulesJsonController;
}
