import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handlers } from 'src/infrastructure/browser/router/messageHandlers';
import { SimpleContainer } from 'src/infrastructure/di/container';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';

// Chrome APIのモック
const mockChromeTabsService = {
  sendMessage: vi.fn()
};

describe('handlers.ping', () => {
  let container: SimpleContainer;
  let messageHandlers: ReturnType<typeof handlers>;

  beforeEach(() => {
    container = new SimpleContainer();
    
    // ChromeTabsServiceをモックでコンテナに登録
    container.register(ChromeTabsService, () => mockChromeTabsService as any);
    
    messageHandlers = handlers(container);
    
    vi.clearAllMocks();
  });

  it('pingメッセージに対してpongを返す', async () => {
    const result = await messageHandlers.ping();

    expect(result).toEqual({ pong: true });
  });

  it('Promiseを返す（async関数）', () => {
    const result = messageHandlers.ping();

    expect(result).toBeInstanceOf(Promise);
    
    return expect(result).resolves.toEqual({ pong: true });
  });

  it('引数なしで正常に動作する', async () => {
    // 引数なしでも呼び出せることを確認
    const result = await messageHandlers.ping();

    expect(result).toEqual({ pong: true });
  });
});
