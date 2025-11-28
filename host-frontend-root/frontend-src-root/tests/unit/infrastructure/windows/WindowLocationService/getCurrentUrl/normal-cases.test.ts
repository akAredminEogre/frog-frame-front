import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WindowLocationService } from 'src/infrastructure/windows/WindowLocationService';

/**
 * WindowLocationService.getCurrentUrl - 正常系テスト
 *
 * 1. window.location.hrefの値を返す
 */
describe('WindowLocationService.getCurrentUrl - 正常系', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('should return window.location.href value', () => {
    // Arrange
    const testUrl = 'https://example.com/test/page';
    Object.defineProperty(window, 'location', {
      value: { href: testUrl },
      writable: true,
    });

    const service = new WindowLocationService();

    // Act
    const result = service.getCurrentUrl();

    // Assert
    expect(result).toBe(testUrl);
  });

  it('should return different URLs correctly', () => {
    // Arrange
    const testUrl = 'https://another-site.org/path?query=value';
    Object.defineProperty(window, 'location', {
      value: { href: testUrl },
      writable: true,
    });

    const service = new WindowLocationService();

    // Act
    const result = service.getCurrentUrl();

    // Assert
    expect(result).toBe(testUrl);
  });
});
