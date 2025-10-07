import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RefreshAllTabsAfterRuleUpdateUseCase } from 'src/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * RefreshAllTabsAfterRuleUpdateUseCase.execute - 正常系テスト
 * 1. URLパターンが前方一致するタブにのみメッセージを送信する
 * 2. URLパターンが設定されていない場合は、どのタブにもメッセージを送信しない
 * 3. 複数のタブがマッチする場合、すべてのタブにメッセージを送信する
 */
describe('RefreshAllTabsAfterRuleUpdateUseCase.execute - 正常系', () => {
  let useCase: RefreshAllTabsAfterRuleUpdateUseCase;
  let mockChromeTabsService: IChromeTabsService;

  beforeEach(() => {
    // モックサービスの初期化
    mockChromeTabsService = {
      sendMessage: vi.fn(),
      queryTabs: vi.fn(),
    };

    // テスト対象の初期化
    useCase = new RefreshAllTabsAfterRuleUpdateUseCase(mockChromeTabsService);
  });

  it('URLパターンが前方一致するタブにのみメッセージを送信する', async () => {
    // Arrange
    const rule = new RewriteRule(
      'rule-001',
      'oldText',
      'newText',
      'https://example.com',
      false
    );

    const tabs = [
      { id: 1, url: 'https://example.com/page1' },
      { id: 2, url: 'https://example.com/page2' },
      { id: 3, url: 'https://other.com/page' },
    ];

    vi.mocked(mockChromeTabsService.queryTabs).mockResolvedValue(tabs);
    vi.mocked(mockChromeTabsService.sendMessage).mockResolvedValue(undefined);

    // Act
    await useCase.execute(rule);

    // Assert
    expect(mockChromeTabsService.queryTabs).toHaveBeenCalledTimes(1);
    expect(mockChromeTabsService.queryTabs).toHaveBeenCalledWith({});
    expect(mockChromeTabsService.sendMessage).toHaveBeenCalledTimes(2);
    expect(mockChromeTabsService.sendMessage).toHaveBeenCalledWith(1, {
      type: 'applyAllRules',
      tabUrl: 'https://example.com/page1',
    });
    expect(mockChromeTabsService.sendMessage).toHaveBeenCalledWith(2, {
      type: 'applyAllRules',
      tabUrl: 'https://example.com/page2',
    });
  });

  it('URLパターンが設定されていない場合は、どのタブにもメッセージを送信しない', async () => {
    // Arrange
    const rule = new RewriteRule(
      'rule-002',
      'oldText',
      'newText',
      "",
      false
    );

    vi.mocked(mockChromeTabsService.queryTabs).mockResolvedValue([]);
    vi.mocked(mockChromeTabsService.sendMessage).mockResolvedValue(undefined);

    // Act
    await useCase.execute(rule);

    // Assert
    // urlPatternが空文字列の場合、早期リターンするのでqueryTabsは呼ばれない
    expect(mockChromeTabsService.queryTabs).not.toHaveBeenCalled();
    expect(mockChromeTabsService.sendMessage).not.toHaveBeenCalled();
  });

  it('複数のタブがマッチする場合、すべてのタブにメッセージを送信する', async () => {
    // Arrange
    const rule = new RewriteRule(
      'rule-003',
      'oldText',
      'newText',
      'https://example.com',
      false
    );

    const tabs = [
      { id: 1, url: 'https://example.com/' },
      { id: 2, url: 'https://example.com/page1' },
      { id: 3, url: 'https://example.com/page2' },
      { id: 4, url: 'https://example.com/page3' },
    ];

    vi.mocked(mockChromeTabsService.queryTabs).mockResolvedValue(tabs);
    vi.mocked(mockChromeTabsService.sendMessage).mockResolvedValue(undefined);

    // Act
    await useCase.execute(rule);

    // Assert
    expect(mockChromeTabsService.queryTabs).toHaveBeenCalledTimes(1);
    expect(mockChromeTabsService.queryTabs).toHaveBeenCalledWith({});
    expect(mockChromeTabsService.sendMessage).toHaveBeenCalledTimes(4);
  });

  it('タブのURLが存在しない場合は無視する', async () => {
    // Arrange
    const rule = new RewriteRule(
      'rule-004',
      'oldText',
      'newText',
      'https://example.com',
      false
    );

    const tabs = [
      { id: 1, url: 'https://example.com/page1' },
      { id: 2, url: undefined },
      { id: 3, url: 'https://example.com/page2' },
    ];

    vi.mocked(mockChromeTabsService.queryTabs).mockResolvedValue(tabs);
    vi.mocked(mockChromeTabsService.sendMessage).mockResolvedValue(undefined);

    // Act
    await useCase.execute(rule);

    // Assert
    expect(mockChromeTabsService.queryTabs).toHaveBeenCalledWith({});
    expect(mockChromeTabsService.sendMessage).toHaveBeenCalledTimes(2);
  });

  it('タブのIDが存在しない場合は無視する', async () => {
    // Arrange
    const rule = new RewriteRule(
      'rule-005',
      'oldText',
      'newText',
      'https://example.com',
      false
    );

    const tabs = [
      { id: 1, url: 'https://example.com/page1' },
      { id: undefined, url: 'https://example.com/page2' },
      { id: 3, url: 'https://example.com/page3' },
    ];

    vi.mocked(mockChromeTabsService.queryTabs).mockResolvedValue(tabs);
    vi.mocked(mockChromeTabsService.sendMessage).mockResolvedValue(undefined);

    // Act
    await useCase.execute(rule);

    // Assert
    expect(mockChromeTabsService.queryTabs).toHaveBeenCalledWith({});
    expect(mockChromeTabsService.sendMessage).toHaveBeenCalledTimes(2);
  });

  it('メッセージ送信に失敗してもエラーをスローしない', async () => {
    // Arrange
    const rule = new RewriteRule(
      'rule-006',
      'oldText',
      'newText',
      'https://example.com',
      false
    );

    const tabs = [
      { id: 1, url: 'https://example.com/page1' },
      { id: 2, url: 'https://example.com/page2' },
    ];

    vi.mocked(mockChromeTabsService.queryTabs).mockResolvedValue(tabs);
    vi.mocked(mockChromeTabsService.sendMessage)
      .mockRejectedValueOnce(new Error('Tab not found'))
      .mockResolvedValueOnce(undefined);

    // Act & Assert
    await expect(useCase.execute(rule)).resolves.not.toThrow();
    expect(mockChromeTabsService.queryTabs).toHaveBeenCalledWith({});
    expect(mockChromeTabsService.sendMessage).toHaveBeenCalledTimes(2);
  });
});
