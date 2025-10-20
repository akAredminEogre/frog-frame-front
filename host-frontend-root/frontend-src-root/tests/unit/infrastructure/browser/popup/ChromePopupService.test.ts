import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChromePopupService } from 'src/infrastructure/browser/popup/ChromePopupService';
import type { IPopupService } from 'src/application/ports/IPopupService';

// Chrome APIのモック設定
const mockChromeAction = {
  openPopup: vi.fn()
};

// グローバルなchromeオブジェクトをモック
Object.defineProperty(globalThis, 'chrome', {
  value: {
    action: mockChromeAction
  },
  writable: true
});

describe('ChromePopupService', () => {
  let service: IPopupService;

  beforeEach(() => {
    service = new ChromePopupService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('openPopup', () => {
    it('should call chrome.action.openPopup', async () => {
      // Arrange
      mockChromeAction.openPopup.mockImplementation(() => {
        // chrome.action.openPopup は戻り値がない
      });

      // Act
      await service.openPopup();

      // Assert
      expect(mockChromeAction.openPopup).toHaveBeenCalledTimes(1);
      expect(mockChromeAction.openPopup).toHaveBeenCalledWith();
    });

    it('should resolve successfully when chrome.action.openPopup completes', async () => {
      // Arrange
      mockChromeAction.openPopup.mockImplementation(() => {
        // 正常完了をシミュレート
      });

      // Act & Assert
      await expect(service.openPopup()).resolves.toBeUndefined();
    });

    it('should handle chrome.action.openPopup errors gracefully', async () => {
      // Arrange
      const error = new Error('Failed to open popup');
      mockChromeAction.openPopup.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(service.openPopup()).rejects.toThrow('Failed to open popup');
    });

    it('should implement IPopupService interface', () => {
      // Act & Assert
      expect(service).toHaveProperty('openPopup');
      expect(typeof service.openPopup).toBe('function');
    });
  });

  describe('interface compliance', () => {
    it('should be an instance of ChromePopupService', () => {
      // Act & Assert
      expect(service).toBeInstanceOf(ChromePopupService);
    });

    it('should have all required IPopupService methods', () => {
      // Act & Assert
      const requiredMethods = ['openPopup'];
      
      requiredMethods.forEach(method => {
        expect(service).toHaveProperty(method);
        expect(typeof (service as any)[method]).toBe('function');
      });
    });
  });

  describe('Promise behavior', () => {
    it('should return a Promise', () => {
      // Arrange
      mockChromeAction.openPopup.mockImplementation(() => {});

      // Act
      const result = service.openPopup();

      // Assert
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve the Promise when chrome API call succeeds', async () => {
      // Arrange
      mockChromeAction.openPopup.mockImplementation(() => {
        // 成功時の動作をシミュレート
      });

      // Act
      const result = await service.openPopup();

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('error scenarios', () => {
    it('should propagate chrome API errors', async () => {
      // Arrange
      const chromeError = new Error('Chrome extension context invalidated');
      mockChromeAction.openPopup.mockImplementation(() => {
        throw chromeError;
      });

      // Act & Assert
      await expect(service.openPopup()).rejects.toThrow('Chrome extension context invalidated');
    });

    it('should handle undefined chrome.action', async () => {
      // Arrange
      const originalChrome = globalThis.chrome;
      (globalThis as any).chrome = { action: undefined };

      // Act & Assert
      await expect(service.openPopup()).rejects.toThrow();

      // Cleanup
      (globalThis as any).chrome = originalChrome;
    });
  });
});
