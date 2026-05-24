/**
 * IDeleteRuleControllerFactoryのモックオブジェクトを生成する
 *
 * factory.create()が呼ばれた際に渡されるonSuccess/onErrorコールバックを
 * キャプチャし、テスト側から呼び出せるようにする。
 */
import { vi } from 'vitest';

import { IDeleteRuleController } from 'src/interface-adapters/controllers/IDeleteRuleController';
import {
  DeleteErrorCallback,
  DeleteSuccessCallback,
  IDeleteRuleControllerFactory,
} from 'src/interface-adapters/factories/IDeleteRuleControllerFactory';

export interface MockDeleteRuleControllerFactoryResult {
  factory: IDeleteRuleControllerFactory;
  controller: IDeleteRuleController;
  getCapturedOnSuccess: () => DeleteSuccessCallback | null;
  getCapturedOnError: () => DeleteErrorCallback | null;
}

/**
 * IDeleteRuleControllerFactoryのモックを生成する
 *
 * @returns factory - モックファクトリ
 * @returns controller - factory.create()が返すモックコントローラ
 * @returns getCapturedOnSuccess - factory.create()に渡されたonSuccessコールバックを取得
 * @returns getCapturedOnError - factory.create()に渡されたonErrorコールバックを取得
 */
export const createMockDeleteRuleControllerFactory = (): MockDeleteRuleControllerFactoryResult => {
  let capturedOnSuccess: DeleteSuccessCallback | null = null;
  let capturedOnError: DeleteErrorCallback | null = null;

  const controller: IDeleteRuleController = {
    deleteRule: vi.fn().mockResolvedValue(undefined),
  };

  const factory: IDeleteRuleControllerFactory = {
    create: vi.fn((onSuccess: DeleteSuccessCallback, onError: DeleteErrorCallback) => {
      capturedOnSuccess = onSuccess;
      capturedOnError = onError;
      return controller;
    }),
  };

  return {
    factory,
    controller,
    getCapturedOnSuccess: () => capturedOnSuccess,
    getCapturedOnError: () => capturedOnError,
  };
};
