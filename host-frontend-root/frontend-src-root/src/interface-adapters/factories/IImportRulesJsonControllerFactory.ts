export type ImportSuccessCallback = (formattedMessage: string) => void;
export type ImportErrorCallback = (formattedMessage: string) => void;

export interface IImportRulesJsonController {
  importRulesJson(file: File): Promise<void>;
}

/**
 * ImportRulesJsonコントローラーをReactコールバック付きで生成するFactoryのインターフェース
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export interface IImportRulesJsonControllerFactory {
  create(
    onSuccess: ImportSuccessCallback,
    onError: ImportErrorCallback
  ): IImportRulesJsonController;
}
