import { createMockTabsService } from 'tests/unit/application/ports/IChromeTabsService/createMockTabsService';
import { createMockPopupService } from 'tests/unit/application/ports/IPopupService/createMockPopupService';
import { createMockSelectedPageTextRepository } from 'tests/unit/application/ports/ISelectedPageTextRepository/createMockSelectedPageTextRepository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { IPopupService } from 'src/application/ports/IPopupService';
import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';

/**
 * 1. tabId=1(最小有効値)での正常処理とCurrentTab.tabId検証
 * 2. tabId=MAX_SAFE_INTEGER(最大値)での正常処理とCurrentTab.tabId検証
 */
describe('HandleContextMenuReplaceDomElement.execute - エッジケース', () => {
  let useCase: HandleContextMenuReplaceDomElement;
  let mockTabsService: IChromeTabsService;
  let mockSelectedPageTextRepository: ISelectedPageTextRepository;
  let mockPopupService: IPopupService;

  beforeEach(() => {
    // モックサービスの初期化
    mockTabsService = createMockTabsService();
    mockSelectedPageTextRepository = createMockSelectedPageTextRepository();
    mockPopupService = createMockPopupService();

    // テスト対象の初期化
    useCase = new HandleContextMenuReplaceDomElement(
      mockTabsService,
      mockSelectedPageTextRepository,
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
    vi.mocked(mockSelectedPageTextRepository.setSelectedPageText).mockResolvedValue();
    vi.mocked(mockPopupService.openPopup).mockResolvedValue();

    // Act
    await useCase.execute(tabId);

    // Assert
    expect(mockTabsService.sendMessage).toHaveBeenCalledWith(
      tabId,
      { type: 'getElementSelection' }
    );
    expect(mockSelectedPageTextRepository.setSelectedPageText).toHaveBeenCalledWith('test');
    expect(mockPopupService.openPopup).toHaveBeenCalledTimes(1);
  });

});
