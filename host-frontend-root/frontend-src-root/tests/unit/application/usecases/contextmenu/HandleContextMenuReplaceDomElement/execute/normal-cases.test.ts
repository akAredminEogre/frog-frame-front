import { createMockTabsService } from 'tests/unit/application/ports/IChromeTabsService/createMockTabsService';
import { createMockPopupService } from 'tests/unit/application/ports/IPopupService/createMockPopupService';
import { createMockSelectedPageTextService } from 'tests/unit/application/ports/ISelectedPageTextService/createMockSelectedPageTextService';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { IPopupService } from 'src/application/ports/IPopupService';
import { ISelectedPageTextService } from 'src/application/ports/ISelectedPageTextService';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';

/**
 * 1. tabId=123, selection=\"selected text\"での正常処理とサービス実行順序検証
 * 2. tabId=456, selection=\"\"(空文字)での正常処理とサービス実行順序検証
 * 3. tabId=789, selection=長文(1000文字)での正常処理とサービス実行順序検証
 * 4. tabId=101, selection=特殊文字・HTML・改行・タブ・全角スペースでの正常処理とサービス実行順序検証
 */
describe('HandleContextMenuReplaceDomElement.execute - 正常系', () => {
  let useCase: HandleContextMenuReplaceDomElement;
  let mockTabsService: IChromeTabsService;
  let mockSelectedPageTextService: ISelectedPageTextService;
  let mockPopupService: IPopupService;

  beforeEach(() => {
    // モックサービスの初期化
    mockTabsService = createMockTabsService();
    mockSelectedPageTextService = createMockSelectedPageTextService();
    mockPopupService = createMockPopupService();

    // テスト対象の初期化
    useCase = new HandleContextMenuReplaceDomElement(
      mockTabsService,
      mockSelectedPageTextService,
      mockPopupService
    );
  });

  it.each([
    {
      description: '正常なtabIdでexecuteを呼び出した時、適切な処理が実行される',
      tabId: 123,
      selection: 'selected text',
    },
    {
      description: '空の選択内容でも正常に処理される',
      tabId: 456,
      selection: '',
    },
    {
      description: '長い選択内容でも正常に処理される',
      tabId: 789,
      selection: 'a'.repeat(1000),
    },
    {
      description: '特殊文字を含む選択内容でも正常に処理される',
      tabId: 101,
      selection: '<script>alert("test")</script>\n改行\t\tタブ　全角スペース',
    },
  ])('$description', async ({ tabId, selection }) => {
    // Arrange
    const mockResponse = { selection };
    
    vi.mocked(mockTabsService.sendMessage).mockResolvedValue(mockResponse);
    vi.mocked(mockSelectedPageTextService.setSelectedPageText).mockResolvedValue();
    vi.mocked(mockPopupService.openPopup).mockResolvedValue();

    // Act
    await useCase.execute(tabId);

    // Assert
    expect(mockTabsService.sendMessage).toHaveBeenCalledTimes(1);
    expect(mockTabsService.sendMessage).toHaveBeenCalledWith(
      tabId,
      { type: 'getElementSelection' }
    );

    expect(mockSelectedPageTextService.setSelectedPageText).toHaveBeenCalledTimes(1);
    expect(mockSelectedPageTextService.setSelectedPageText).toHaveBeenCalledWith(selection);
    
    expect(mockPopupService.openPopup).toHaveBeenCalledTimes(1);
  });
});
