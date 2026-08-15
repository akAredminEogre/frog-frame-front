/**
 * useImportRulesJson - カスタムフックのユニットテスト
 *
 * - 成功時: isImporting解除 + importSuccess設定 + onRulesChanged(一覧更新CB)呼び出し
 * - エラー時: isImporting解除 + importError設定 + onRulesChangedは呼ばない
 * - handleFileSelect開始時: 直前のエラー/成功トーストを消去し isImporting=true にする
 * - dismissImportError / dismissImportSuccess: 各トーストを null に消去する
 * - importRulesJson が予期せず reject した場合: catch で isImporting解除 + importError設定
 */
import { act } from 'react';
import { createMockImportRulesJsonControllerFactory } from 'tests/unit/frameworks-and-drivers/ui/hooks/useImportRulesJson/mocks/createMockImportRulesJsonControllerFactory';
import {
  flushPromises,
  UseImportRulesJsonTestHelper,
} from 'tests/unit/frameworks-and-drivers/ui/hooks/useImportRulesJson/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { container } from 'src/frameworks-and-drivers/di/container';

vi.mock('src/frameworks-and-drivers/di/container', () => ({
  container: {
    resolve: vi.fn(),
  },
}));

describe('useImportRulesJson', () => {
  const helper = new UseImportRulesJsonTestHelper();
  let mockResult: ReturnType<typeof createMockImportRulesJsonControllerFactory>;

  beforeEach(() => {
    vi.clearAllMocks();
    helper.setup();
    mockResult = createMockImportRulesJsonControllerFactory();
    vi.mocked(container.resolve).mockReturnValue(mockResult.factory);
  });

  afterEach(() => {
    helper.cleanup();
    vi.resetAllMocks();
  });

  it('成功時: isImportingを解除し importSuccess を設定し onRulesChanged を呼ぶ', async () => {
    // importRulesJson を未解決にしてインポート中状態を作る
    let resolveImport!: () => void;
    vi.mocked(mockResult.controller.importRulesJson).mockReturnValue(
      new Promise<void>((resolve) => {
        resolveImport = resolve;
      })
    );

    await helper.render();
    await helper.startHandleFileSelectWithoutAwaiting();
    expect(helper.getIsImporting()).toBe(true);

    // Presenter → onSuccess 相当の callback を発火
    const onSuccess = mockResult.getCapturedOnSuccess();
    expect(onSuccess).not.toBeNull();
    await act(async () => {
      onSuccess!('3件のルールをインポートしました');
      await flushPromises();
    });

    expect(helper.getIsImporting()).toBe(false);
    expect(helper.getImportSuccess()).toBe('3件のルールをインポートしました');
    expect(helper.getImportError()).toBeNull();
    expect(helper.getOnRulesChanged()).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveImport();
      await flushPromises();
    });
  });

  it('エラー時: isImportingを解除し importError を設定し onRulesChanged は呼ばない', async () => {
    let resolveImport!: () => void;
    vi.mocked(mockResult.controller.importRulesJson).mockReturnValue(
      new Promise<void>((resolve) => {
        resolveImport = resolve;
      })
    );

    await helper.render();
    await helper.startHandleFileSelectWithoutAwaiting();
    expect(helper.getIsImporting()).toBe(true);

    const onError = mockResult.getCapturedOnError();
    expect(onError).not.toBeNull();
    await act(async () => {
      onError!('JSONスキーマが不正です');
      await flushPromises();
    });

    expect(helper.getIsImporting()).toBe(false);
    expect(helper.getImportError()).toBe('JSONスキーマが不正です');
    expect(helper.getImportSuccess()).toBeNull();
    expect(helper.getOnRulesChanged()).not.toHaveBeenCalled();

    await act(async () => {
      resolveImport();
      await flushPromises();
    });
  });

  it('handleFileSelect開始時: 直前のエラートーストを消去し isImporting=true にする', async () => {
    // 直前にエラーを設定
    let resolveFirst!: () => void;
    vi.mocked(mockResult.controller.importRulesJson).mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveFirst = resolve;
      })
    );
    await helper.render();
    await helper.startHandleFileSelectWithoutAwaiting();
    const onError = mockResult.getCapturedOnError();
    await act(async () => {
      onError!('前回のエラー');
      await flushPromises();
    });
    expect(helper.getImportError()).toBe('前回のエラー');
    await act(async () => {
      resolveFirst();
      await flushPromises();
    });

    // 2回目の選択開始で直前のエラーが消去され importing=true になる
    let resolveSecond!: () => void;
    vi.mocked(mockResult.controller.importRulesJson).mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveSecond = resolve;
      })
    );
    await helper.startHandleFileSelectWithoutAwaiting();

    expect(helper.getImportError()).toBeNull();
    expect(helper.getImportSuccess()).toBeNull();
    expect(helper.getIsImporting()).toBe(true);

    await act(async () => {
      resolveSecond();
      await flushPromises();
    });
  });

  it('dismissImportError / dismissImportSuccess でトーストを消去する', async () => {
    await helper.render();

    const onError = mockResult.getCapturedOnError();
    await act(async () => {
      onError!('エラーメッセージ');
      await flushPromises();
    });
    expect(helper.getImportError()).toBe('エラーメッセージ');
    await helper.callDismissImportError();
    expect(helper.getImportError()).toBeNull();

    const onSuccess = mockResult.getCapturedOnSuccess();
    await act(async () => {
      onSuccess!('成功メッセージ');
      await flushPromises();
    });
    expect(helper.getImportSuccess()).toBe('成功メッセージ');
    await helper.callDismissImportSuccess();
    expect(helper.getImportSuccess()).toBeNull();
  });

  it('importRulesJson が予期せず reject した場合: isImporting解除 + importError設定', async () => {
    vi.mocked(mockResult.controller.importRulesJson).mockRejectedValue(
      new Error('予期しない例外')
    );

    await helper.render();
    await helper.callHandleFileSelect();

    expect(helper.getIsImporting()).toBe(false);
    expect(helper.getImportError()).toBe('予期しない例外');
    expect(helper.getOnRulesChanged()).not.toHaveBeenCalled();
  });
});
