import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

// モックホルダー
const mockHolder = vi.hoisted(() => {
  return {
    onMessage: vi.fn(),
    resolve: vi.fn(),
    execute: vi.fn(),
    sendApplyAllRulesMessage: vi.fn(),
    toDto: vi.fn(),
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
 * 1. getAllRulesハンドラーを登録
 * 2. applyAllRulesハンドラーを登録
 */
describe('registerBackgroundMessageHandlers - 正常系', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('ハンドラー登録', () => {
    it('should register getAllRules handler', () => {
      // Act
      registerBackgroundMessageHandlers();

      // Assert
      expect(mockHolder.onMessage).toHaveBeenCalledWith('getAllRules', expect.any(Function));
    });

    it('should register applyAllRules handler', () => {
      // Act
      registerBackgroundMessageHandlers();

      // Assert
      expect(mockHolder.onMessage).toHaveBeenCalledWith('applyAllRules', expect.any(Function));
    });

    it('should register exactly two handlers', () => {
      // Act
      registerBackgroundMessageHandlers();

      // Assert
      expect(mockHolder.onMessage).toHaveBeenCalledTimes(2);
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
        success: true,
        rules: expectedDtos,
      });
    });

    it('should return success with empty array when no rules exist', async () => {
      // Arrange
      mockHolder.execute.mockResolvedValue([]);

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
        success: true,
        response: mockResponse,
      });
    });
  });
});
