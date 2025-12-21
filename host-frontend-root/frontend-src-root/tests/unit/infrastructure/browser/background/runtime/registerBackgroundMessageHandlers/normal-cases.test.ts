import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

// モックホルダー
const mockHolder = vi.hoisted(() => {
  return {
    resolve: vi.fn(),
    execute: vi.fn(),
    sendApplyAllRulesMessage: vi.fn(),
    toDto: vi.fn(),
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

// RewriteRuleMapperをモック
vi.mock('src/interface-adapters/mappers/RewriteRuleMapper', () => ({
  RewriteRuleMapper: class {
    toDto = mockHolder.toDto;
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
 * registerBackgroundMessageHandlers - 正常系テスト
 *
 * この関数の責務:
 * 1. chrome.runtime.onMessage.addListenerを使用してメッセージリスナーを登録
 * 2. getAllRulesメッセージを処理してルール一覧を返す
 * 3. applyAllRulesメッセージを処理してコンテンツスクリプトにメッセージを転送
 */
describe('registerBackgroundMessageHandlers - 正常系', () => {
  let capturedListener: (
    message: { type: string; tabId?: number; tabUrl?: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ) => boolean;

  beforeEach(() => {
    vi.clearAllMocks();

    // addListenerに渡されるコールバックをキャプチャ
    mockAddListener.mockImplementation((listener) => {
      capturedListener = listener;
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('リスナー登録', () => {
    it('should register chrome.runtime.onMessage listener', () => {
      // Act
      registerBackgroundMessageHandlers();

      // Assert
      expect(mockAddListener).toHaveBeenCalledTimes(1);
      expect(mockAddListener).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('getAllRulesハンドラー', () => {
    it('should return success with DTOs when rules exist', async () => {
      // Arrange
      const mockRules = [
        new RewriteRule(1, 'old1', 'new1', 'https://example.com', false, true),
        new RewriteRule(2, 'old2', 'new2', 'https://test.com', true, false),
      ];

      const expectedDtos = [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false, isActive: true },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://test.com', isRegex: true, isActive: false },
      ];

      mockHolder.execute.mockResolvedValue(mockRules);
      // toDtoが呼ばれるたびに対応するDTOを返す
      mockHolder.toDto.mockImplementation((rule: { id: number }) => {
        return expectedDtos.find((dto) => dto.id === rule.id);
      });

      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener({ type: 'getAllRules' }, {} as chrome.runtime.MessageSender, sendResponse);

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true); // 非同期レスポンスを示す
      expect(sendResponse).toHaveBeenCalledWith({
        success: true,
        rules: expectedDtos,
      });
    });

    it('should return success with empty array when no rules exist', async () => {
      // Arrange
      mockHolder.execute.mockResolvedValue([]);

      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener({ type: 'getAllRules' }, {} as chrome.runtime.MessageSender, sendResponse);

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(result).toBe(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: true,
        rules: [],
      });
    });
  });

  describe('applyAllRulesハンドラー', () => {
    it('should return success with response when message is sent successfully', async () => {
      // Arrange
      const mockResponse = { applied: true };
      mockHolder.sendApplyAllRulesMessage.mockResolvedValue(mockResponse);
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
        success: true,
        response: mockResponse,
      });
    });
  });

  describe('未知のメッセージタイプ', () => {
    it('should return false for unknown message types', () => {
      // Arrange
      registerBackgroundMessageHandlers();

      // Act
      const sendResponse = vi.fn();
      const result = capturedListener({ type: 'unknownType' }, {} as chrome.runtime.MessageSender, sendResponse);

      // Assert
      expect(result).toBe(false);
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });
});
