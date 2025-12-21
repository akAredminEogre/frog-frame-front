import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// モックホルダー
const mockHolder = vi.hoisted(() => {
  return {
    resolve: vi.fn(),
    execute: vi.fn(),
    sendApplyAllRulesMessage: vi.fn(),
  };
});

// containerをモック
vi.mock('src/frameworks-and-drivers/di/container', () => ({
  container: {
    resolve: mockHolder.resolve,
  },
}));

// GetAllRewriteRulesUseCaseをモック（クラスとして正しくモック）
vi.mock('src/application/usecases/rule/GetAllRewriteRulesUseCase', () => {
  return {
    GetAllRewriteRulesUseCase: class {
      execute = mockHolder.execute;
    },
  };
});

// ChromeTabsServiceをモック
vi.mock('src/infrastructure/browser/tabs/ChromeTabsService', () => ({
  ChromeTabsService: class {
    sendApplyAllRulesMessage = mockHolder.sendApplyAllRulesMessage;
  },
}));

// chrome.runtime.onMessage.addListenerをモック
const mockAddListener = vi.fn();
vi.stubGlobal('chrome', {
  runtime: {
    onMessage: {
      addListener: mockAddListener,
    },
  },
});

import { registerBackgroundMessageHandlers } from 'src/infrastructure/browser/background/runtime/registerBackgroundMessageHandlers';

/**
 * registerBackgroundMessageHandlers - エラーケーステスト
 *
 * エラーハンドリングの検証:
 * 1. Errorオブジェクトからメッセージを抽出
 * 2. 文字列エラーをそのまま返す
 * 3. その他のエラー型は'Unknown error occurred'を返す
 */
describe('registerBackgroundMessageHandlers - エラーケース', () => {
  let capturedListener: (
    message: { type: string; tabId?: number; tabUrl?: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ) => boolean;

  beforeEach(() => {
    vi.clearAllMocks();
    // console.errorをモック
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // addListenerに渡されるコールバックをキャプチャ
    mockAddListener.mockImplementation((listener) => {
      capturedListener = listener;
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllRulesハンドラー - エラーケース', () => {
    it('should return error response when Error is thrown', async () => {
      // Arrange
      mockHolder.execute.mockRejectedValue(new Error('Database connection failed'));

      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener({ type: 'getAllRules' }, {} as chrome.runtime.MessageSender, sendResponse);

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Database connection failed',
      });
    });

    it('should return error response when string error is thrown', async () => {
      // Arrange
      mockHolder.execute.mockRejectedValue('String error message');

      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener({ type: 'getAllRules' }, {} as chrome.runtime.MessageSender, sendResponse);

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'String error message',
      });
    });

    it('should return Unknown error occurred when non-Error/non-string is thrown', async () => {
      // Arrange
      mockHolder.execute.mockRejectedValue({ code: 500 });

      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener({ type: 'getAllRules' }, {} as chrome.runtime.MessageSender, sendResponse);

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Unknown error occurred',
      });
    });
  });

  describe('applyAllRulesハンドラー - バリデーションエラー', () => {
    it('should return error when tabId is missing', async () => {
      // Arrange
      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener(
        { type: 'applyAllRules', tabUrl: 'https://example.com' } as { type: string; tabId?: number; tabUrl?: string },
        {} as chrome.runtime.MessageSender,
        sendResponse
      );

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid message: tabId (number) and tabUrl (string) are required',
      });
    });

    it('should return error when tabUrl is missing', async () => {
      // Arrange
      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener(
        { type: 'applyAllRules', tabId: 123 } as { type: string; tabId?: number; tabUrl?: string },
        {} as chrome.runtime.MessageSender,
        sendResponse
      );

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid message: tabId (number) and tabUrl (string) are required',
      });
    });

    it('should return error when tabId is not a number', async () => {
      // Arrange
      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { type: 'applyAllRules', tabId: '123', tabUrl: 'https://example.com' } as any,
        {} as chrome.runtime.MessageSender,
        sendResponse
      );

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid message: tabId (number) and tabUrl (string) are required',
      });
    });
  });

  describe('applyAllRulesハンドラー - エラーケース', () => {
    it('should return error response when Error is thrown', async () => {
      // Arrange
      mockHolder.sendApplyAllRulesMessage.mockRejectedValue(new Error('Tab not found'));
      mockHolder.resolve.mockReturnValue({
        sendApplyAllRulesMessage: mockHolder.sendApplyAllRulesMessage,
      });

      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener(
        { type: 'applyAllRules', tabId: 123, tabUrl: 'https://example.com' },
        {} as chrome.runtime.MessageSender,
        sendResponse
      );

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Tab not found',
      });
    });

    it('should return error response when string error is thrown', async () => {
      // Arrange
      mockHolder.sendApplyAllRulesMessage.mockRejectedValue('Content script not loaded');
      mockHolder.resolve.mockReturnValue({
        sendApplyAllRulesMessage: mockHolder.sendApplyAllRulesMessage,
      });

      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener(
        { type: 'applyAllRules', tabId: 123, tabUrl: 'https://example.com' },
        {} as chrome.runtime.MessageSender,
        sendResponse
      );

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Content script not loaded',
      });
    });

    it('should return Unknown error occurred when non-Error/non-string is thrown', async () => {
      // Arrange
      mockHolder.sendApplyAllRulesMessage.mockRejectedValue(null);
      mockHolder.resolve.mockReturnValue({
        sendApplyAllRulesMessage: mockHolder.sendApplyAllRulesMessage,
      });

      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener(
        { type: 'applyAllRules', tabId: 123, tabUrl: 'https://example.com' },
        {} as chrome.runtime.MessageSender,
        sendResponse
      );

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Unknown error occurred',
      });
    });
  });
});
