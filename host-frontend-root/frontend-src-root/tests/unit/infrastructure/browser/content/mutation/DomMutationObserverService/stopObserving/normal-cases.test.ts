import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DomMutationObserverService } from 'src/infrastructure/browser/content/mutation/DomMutationObserverService';

/**
 * DomMutationObserverService.stopObserving - 正常系テスト
 *
 * 1. stopObservingを呼び出すとMutationObserverのdisconnectが呼ばれる
 */
describe('DomMutationObserverService.stopObserving - 正常系', () => {
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

  it('should call MutationObserver.disconnect when stopObserving is called', () => {
    // Arrange
    const service = new DomMutationObserverService('https://example.com');

    // Act
    service.stopObserving();

    // Assert
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
