import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { IConfirmImportController } from 'src/interface-adapters/controllers/IConfirmImportController';
import { IPreviewRulesJsonController } from 'src/interface-adapters/controllers/IPreviewRulesJsonController';

export type PreviewCallback = (currentCount: number, importCount: number, validatedRules: RewriteRule[]) => void;
/** @deprecated タスクD削除予定。IImportRulesJsonPresenter（旧）との後方互換用。 */
export type ImportPreviewCallback = (currentCount: number, importCount: number) => void;
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
