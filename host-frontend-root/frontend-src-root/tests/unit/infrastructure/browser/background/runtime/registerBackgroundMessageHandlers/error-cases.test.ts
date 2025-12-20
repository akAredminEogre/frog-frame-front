import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// モックホルダー
const mockHolder = vi.hoisted(() => {
  return {
    onMessage: vi.fn(),
    resolve: vi.fn(),
    execute: vi.fn(),
    sendApplyAllRulesMessage: vi.fn(),
  };
});

// backgroundMessagingをモック
vi.mock('src/frameworks-and-drivers/messaging/backgroundMessaging', () => ({
  backgroundMessaging: {
    onMessage: mockHolder.onMessage,
  },
}));

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
  beforeEach(() => {
    vi.clearAllMocks();
    // console.errorをモック
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllRulesハンドラー - エラーケース', () => {
    it('should return error response when Error is thrown', async () => {
      // Arrange
      mockHolder.execute.mockRejectedValue(new Error('Database connection failed'));

      let capturedHandler: (() => Promise<unknown>) | null = null;
      mockHolder.onMessage.mockImplementation((type: string, handler: () => Promise<unknown>) => {
        if (type === 'getAllRules') {
          capturedHandler = handler;
        }
      });

      registerBackgroundMessageHandlers();

      // Act
      const result = await capturedHandler!();

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Database connection failed',
      });
    });

    it('should return error response when string error is thrown', async () => {
      // Arrange
      mockHolder.execute.mockRejectedValue('String error message');

      let capturedHandler: (() => Promise<unknown>) | null = null;
      mockHolder.onMessage.mockImplementation((type: string, handler: () => Promise<unknown>) => {
        if (type === 'getAllRules') {
          capturedHandler = handler;
        }
      });

      registerBackgroundMessageHandlers();

      // Act
      const result = await capturedHandler!();

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'String error message',
      });
    });

    it('should return Unknown error occurred when non-Error/non-string is thrown', async () => {
      // Arrange
      mockHolder.execute.mockRejectedValue({ code: 500 });

      let capturedHandler: (() => Promise<unknown>) | null = null;
      mockHolder.onMessage.mockImplementation((type: string, handler: () => Promise<unknown>) => {
        if (type === 'getAllRules') {
          capturedHandler = handler;
        }
      });

      registerBackgroundMessageHandlers();

      // Act
      const result = await capturedHandler!();

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Unknown error occurred',
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

      let capturedHandler: ((message: { data: { tabId: number; tabUrl: string } }) => Promise<unknown>) | null = null;
      mockHolder.onMessage.mockImplementation((type: string, handler: (message: { data: { tabId: number; tabUrl: string } }) => Promise<unknown>) => {
        if (type === 'applyAllRules') {
          capturedHandler = handler;
        }
      });

      registerBackgroundMessageHandlers();

      // Act
      const result = await capturedHandler!({ data: { tabId: 123, tabUrl: 'https://example.com' } });

      // Assert
      expect(result).toEqual({
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

      let capturedHandler: ((message: { data: { tabId: number; tabUrl: string } }) => Promise<unknown>) | null = null;
      mockHolder.onMessage.mockImplementation((type: string, handler: (message: { data: { tabId: number; tabUrl: string } }) => Promise<unknown>) => {
        if (type === 'applyAllRules') {
          capturedHandler = handler;
        }
      });

      registerBackgroundMessageHandlers();

      // Act
      const result = await capturedHandler!({ data: { tabId: 123, tabUrl: 'https://example.com' } });

      // Assert
      expect(result).toEqual({
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

      let capturedHandler: ((message: { data: { tabId: number; tabUrl: string } }) => Promise<unknown>) | null = null;
      mockHolder.onMessage.mockImplementation((type: string, handler: (message: { data: { tabId: number; tabUrl: string } }) => Promise<unknown>) => {
        if (type === 'applyAllRules') {
          capturedHandler = handler;
        }
      });

      registerBackgroundMessageHandlers();

      // Act
      const result = await capturedHandler!({ data: { tabId: 123, tabUrl: 'https://example.com' } });

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Unknown error occurred',
      });
    });
  });
});
