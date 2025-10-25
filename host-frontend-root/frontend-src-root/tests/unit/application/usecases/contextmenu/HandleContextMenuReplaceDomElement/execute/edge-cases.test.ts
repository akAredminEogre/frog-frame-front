import { createMockTabsService } from 'tests/unit/application/ports/IChromeTabsService/createMockTabsService';
import { createMockPopupService } from 'tests/unit/application/ports/IPopupService/createMockPopupService';
import { createMockSelectedPageTextService } from 'tests/unit/application/ports/ISelectedPageTextService/createMockSelectedPageTextService';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { IPopupService } from 'src/application/ports/IPopupService';
import { ISelectedPageTextService } from 'src/application/ports/ISelectedPageTextService';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';

/**
 * 1. tabId=1(最小有効値)での正常処理とCurrentTab.tabId検証
 * 2. tabId=MAX_SAFE_INTEGER(最大値)での正常処理とCurrentTab.tabId検証
 */
describe('HandleContextMenuReplaceDomElement.execute - エッジケース', () => {
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
      description: 'tabId 1（最小有効値）でも正常に処理される',
      tabId: 1,
    },
    {
      description: '非常に大きなtabIdでも処理される',
      tabId: Number.MAX_SAFE_INTEGER,
    },
  ])('$description', async ({ tabId }) => {
    // Arrange
    const mockResponse = { selection: 'test' };
    
    vi.mocked(mockTabsService.sendMessage).mockResolvedValue(mockResponse);
    vi.mocked(mockSelectedPageTextService.setSelectedPageText).mockResolvedValue();
    vi.mocked(mockPopupService.openPopup).mockResolvedValue();

    // Act
    await useCase.execute(tabId);

    // Assert
    expect(mockTabsService.sendMessage).toHaveBeenCalledWith(
      tabId,
      { type: 'getElementSelection' }
    );
    expect(mockSelectedPageTextService.setSelectedPageText).toHaveBeenCalledWith('test');
    expect(mockPopupService.openPopup).toHaveBeenCalledTimes(1);
  });

});
