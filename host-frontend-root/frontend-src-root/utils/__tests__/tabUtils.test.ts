import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getActiveTabOrigin } from '../tabUtils';

// chrome APIのモック
const mockChrome = {
  windows: {
    getLastFocused: vi.fn(),
  },
};

// グローバルスコープにモックを割り当て
vi.stubGlobal('chrome', mockChrome);

describe('getActiveTabOrigin', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.resetAllMocks();
  });

  it('アクティブなタブのオリジンを正しく取得できること', async () => {
    const mockWindow = {
      tabs: [
        { active: false, url: 'https://example.com' },
        { active: true, url: 'https://www.google.com/search?q=test' },
        { active: false, url: 'https://github.com' },
      ],
    };
    mockChrome.windows.getLastFocused.mockResolvedValue(mockWindow as any);

    const origin = await getActiveTabOrigin();
    expect(origin).toBe('https://www.google.com');
    expect(mockChrome.windows.getLastFocused).toHaveBeenCalledWith({
      populate: true,
      windowTypes: ['normal'],
    });
  });

  it('サブディレクトリを含むURLから正しくオリジンを取得できること', async () => {
    const mockWindow = {
      tabs: [
        { active: true, url: 'https://agilemanifesto.org/iso/ja/manifesto.html' },
      ],
    };
    mockChrome.windows.getLastFocused.mockResolvedValue(mockWindow as any);

    const origin = await getActiveTabOrigin();
    expect(origin).toBe('https://agilemanifesto.org');
  });

  it('アクティブなタブが見つからない場合にnullを返すこと', async () => {
    const mockWindow = {
      tabs: [
        { active: false, url: 'https://example.com' },
        { active: false, url: 'https://www.google.com' },
      ],
    };
    mockChrome.windows.getLastFocused.mockResolvedValue(mockWindow as any);

    const origin = await getActiveTabOrigin();
    expect(origin).toBeNull();
  });

  it('ウィンドウが見つからない場合にnullを返すこと', async () => {
    mockChrome.windows.getLastFocused.mockResolvedValue(null as any);

    const origin = await getActiveTabOrigin();
    expect(origin).toBeNull();
  });

  it('アクティブなタブのURLがhttp/httpsではない場合にnullを返すこと', async () => {
    const mockWindow = {
      tabs: [{ active: true, url: 'chrome-extension://some-id/popup.html' }],
    };
    mockChrome.windows.getLastFocused.mockResolvedValue(mockWindow as any);

    const origin = await getActiveTabOrigin();
    expect(origin).toBeNull();
  });

  it('アクティブなタブのURLが無効な場合にnullを返すこと', async () => {
    const mockWindow = {
      tabs: [{ active: true, url: 'invalid-url' }],
    };
    mockChrome.windows.getLastFocused.mockResolvedValue(mockWindow as any);

    const origin = await getActiveTabOrigin();
    expect(origin).toBeNull();
  });

  it('APIがエラーをスローした場合にnullを返すこと', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockChrome.windows.getLastFocused.mockRejectedValue(new Error('API Error'));

    const origin = await getActiveTabOrigin();
    expect(origin).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error getting active tab origin:', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });
});
