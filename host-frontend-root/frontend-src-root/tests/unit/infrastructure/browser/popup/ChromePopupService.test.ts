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
      mockChromeAction.openPopup.mockResolvedValue(undefined);

      // Act
      await service.openPopup();

      // Assert
      expect(mockChromeAction.openPopup).toHaveBeenCalledTimes(1);
      expect(mockChromeAction.openPopup).toHaveBeenCalledWith();
    });

    it('should resolve successfully when chrome.action.openPopup completes', async () => {
      // Arrange
      mockChromeAction.openPopup.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.openPopup()).resolves.toBeUndefined();
    });

    it('should handle when chrome.action.openPopup returns null', async () => {
      // Arrange
      mockChromeAction.openPopup.mockResolvedValue(null);

      // Act & Assert
      await expect(service.openPopup()).resolves.toBeUndefined();
    });

    it('should handle chrome.action.openPopup errors gracefully', async () => {
      // Arrange
      const error = new Error('Test error');
      mockChromeAction.openPopup.mockRejectedValue(error);

      // Act & Assert
      await expect(service.openPopup()).rejects.toThrow('Failed to open popup: Test error');
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      mockChromeAction.openPopup.mockRejectedValue('string error');

      // Act & Assert
      await expect(service.openPopup()).rejects.toThrow('Failed to open popup: Unknown error');
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
      mockChromeAction.openPopup.mockResolvedValue(undefined);

      // Act
      const result = service.openPopup();

      // Assert
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve the Promise when chrome API call succeeds', async () => {
      // Arrange
      mockChromeAction.openPopup.mockResolvedValue(undefined);

      // Act
      const result = await service.openPopup();

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle Promise returned by chrome.action.openPopup', async () => {
      // Arrange
      const mockPromise = Promise.resolve();
      mockChromeAction.openPopup.mockResolvedValue(mockPromise);

      // Act
      await service.openPopup();

      // Assert
      expect(mockChromeAction.openPopup).toHaveBeenCalledTimes(1);
    });
  });

  describe('error scenarios', () => {
    it('should propagate chrome API errors', async () => {
      // Arrange
      const chromeError = new Error('Chrome extension context invalidated');
      mockChromeAction.openPopup.mockRejectedValue(chromeError);

      // Act & Assert
      await expect(service.openPopup()).rejects.toThrow('Failed to open popup: Chrome extension context invalidated');
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

    it('should log errors to console', async () => {
      // Arrange
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      mockChromeAction.openPopup.mockRejectedValue(error);

      // Act
      try {
        await service.openPopup();
      } catch {
        // エラーは期待される
      }

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to open popup:', error);

      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });
});
