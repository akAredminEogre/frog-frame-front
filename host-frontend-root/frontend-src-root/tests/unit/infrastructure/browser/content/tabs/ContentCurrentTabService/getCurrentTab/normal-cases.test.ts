import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContentCurrentTabService } from 'src/infrastructure/browser/content/tabs/ContentCurrentTabService';

/**
 * ContentCurrentTabService.getCurrentTab - 正常系テスト
 *
 * 1. window.location.hrefから現在のURLを取得してTabを返す
 * 2. 返されるTabにはContent Script用の固定tabIdが設定される
 */
describe('ContentCurrentTabService.getCurrentTab - 正常系', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('should return Tab with current URL from window.location.href', async () => {
    // Arrange
    Object.defineProperty(window, 'location', {
      value: { href: 'https://example.com/page' },
      writable: true,
    });

    const service = new ContentCurrentTabService();

    // Act
    const tab = await service.getCurrentTab();

    // Assert
    expect(tab.getTabUrl().value).toBe('https://example.com/page');
  });

  it('should return Tab with fixed tabId for content scripts', async () => {
    // Arrange
    Object.defineProperty(window, 'location', {
      value: { href: 'https://example.com' },
      writable: true,
    });

    const service = new ContentCurrentTabService();

    // Act
    const tab = await service.getCurrentTab();

    // Assert
    expect(tab.getTabId().value).toBe(1);
  });
});
