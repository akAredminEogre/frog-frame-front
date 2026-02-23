import { IImportRulesJsonController } from 'src/interface-adapters/controllers/IImportRulesJsonController';

export type ImportPreviewCallback = (currentCount: number, importCount: number) => void;
export type ImportSuccessCallback = (formattedMessage: string) => void;
export type ImportErrorCallback = (formattedMessage: string) => void;

/**
 * ImportRulesJsonControllerを生成するFactoryのインターフェース
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export interface IImportRulesJsonControllerFactory {
  create(
    onPreview: ImportPreviewCallback,
    onSuccess: ImportSuccessCallback,
    onError: ImportErrorCallback
  ): IImportRulesJsonController;
}
