import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DomMutationObserverService } from 'src/infrastructure/browser/content/mutation/DomMutationObserverService';

/**
 * DomMutationObserverService.startObserving - 正常系テスト
 *
 * 1. startObservingを呼び出すとMutationObserverのobserveが呼ばれる
 * 2. document.bodyを監視対象として設定している
 * 3. childListとsubtreeオプションが有効になっている
 */
describe('DomMutationObserverService.startObserving - 正常系', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    vi.stubGlobal('MutationObserver', vi.fn().mockImplementation(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
    })));
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it('should call MutationObserver.observe when startObserving is called', () => {
    // Arrange
    const service = new DomMutationObserverService('https://example.com');

    // Act
    service.startObserving();

    // Assert
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it('should observe document.body with childList and subtree options', () => {
    // Arrange
    const service = new DomMutationObserverService('https://example.com');

    // Act
    service.startObserving();

    // Assert
    expect(mockObserve).toHaveBeenCalledWith(document.body, {
      childList: true,
      subtree: true,
    });
  });
});
