import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handlers } from 'src/infrastructure/browser/router/messageHandlers';

describe('handlers.ping', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pingメッセージに対してpongを返す', async () => {
    const result = await handlers.ping();

    expect(result).toEqual({ pong: true });
  });

  it('Promiseを返す（async関数）', () => {
    const result = handlers.ping();

    expect(result).toBeInstanceOf(Promise);
    
    return expect(result).resolves.toEqual({ pong: true });
  });

  it('引数なしで正常に動作する', async () => {
    // 引数なしでも呼び出せることを確認
    const result = await handlers.ping();

    expect(result).toEqual({ pong: true });
  });
});
