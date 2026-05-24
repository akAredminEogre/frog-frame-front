import { IDeleteRuleController } from 'src/interface-adapters/controllers/IDeleteRuleController';

export type DeleteSuccessCallback = (ruleId: number) => void;
export type DeleteErrorCallback = (formattedMessage: string) => void;

/**
 * DeleteRuleControllerを生成するFactoryのインターフェース
 * ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン
 */
export interface IDeleteRuleControllerFactory {
  create(
    onSuccess: DeleteSuccessCallback,
    onError: DeleteErrorCallback
  ): IDeleteRuleController;
}
