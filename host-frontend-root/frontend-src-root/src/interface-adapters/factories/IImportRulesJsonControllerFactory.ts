import { IConfirmImportController } from 'src/interface-adapters/controllers/IConfirmImportController';
import { IPreviewRulesJsonController } from 'src/interface-adapters/controllers/IPreviewRulesJsonController';

/**
 * Phase1完了時のUI通知コールバック。
 * validatedRulesはfactory内でconfirmInteractorに保持されるため、呼び出し元には渡さない。
 */
export type PreviewCallback = (currentCount: number, importCount: number) => void;
export type ImportSuccessCallback = (formattedMessage: string) => void;
export type ImportErrorCallback = (formattedMessage: string) => void;

/**
 * Preview/ConfirmコントローラーペアをReactコールバック付きで生成するFactoryのインターフェース
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export interface IImportRulesJsonControllerFactory {
  create(
    onPreview: PreviewCallback,
    onSuccess: ImportSuccessCallback,
    onError: ImportErrorCallback
  ): {
    previewController: IPreviewRulesJsonController;
    confirmController: IConfirmImportController;
  };
}
