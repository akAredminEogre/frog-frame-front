/**
 * IImportRulesJsonControllerFactoryのモックオブジェクトを生成する
 *
 * factory.create()が呼ばれた際に渡されるonSuccess/onErrorコールバックを
 * キャプチャし、テスト側から呼び出せるようにする。
 */
import { vi } from 'vitest';

import {
  IImportRulesJsonController,
  IImportRulesJsonControllerFactory,
  ImportErrorCallback,
  ImportSuccessCallback,
} from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';

export interface MockImportRulesJsonControllerFactoryResult {
  factory: IImportRulesJsonControllerFactory;
  controller: IImportRulesJsonController;
  getCapturedOnSuccess: () => ImportSuccessCallback | null;
  getCapturedOnError: () => ImportErrorCallback | null;
}

/**
 * IImportRulesJsonControllerFactoryのモックを生成する
 *
 * @returns factory - モックファクトリ
 * @returns controller - factory.create()が返すモックコントローラ
 * @returns getCapturedOnSuccess - factory.create()に渡されたonSuccessコールバックを取得
 * @returns getCapturedOnError - factory.create()に渡されたonErrorコールバックを取得
 */
export const createMockImportRulesJsonControllerFactory =
  (): MockImportRulesJsonControllerFactoryResult => {
    let capturedOnSuccess: ImportSuccessCallback | null = null;
    let capturedOnError: ImportErrorCallback | null = null;

    const controller: IImportRulesJsonController = {
      importRulesJson: vi.fn().mockResolvedValue(undefined),
    };

    const factory: IImportRulesJsonControllerFactory = {
      create: vi.fn((onSuccess: ImportSuccessCallback, onError: ImportErrorCallback) => {
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
