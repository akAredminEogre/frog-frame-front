import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { ISelectedPageTextService } from 'src/application/ports/ISelectedPageTextService';
import { IPopupService } from 'src/application/ports/IPopupService';

/**
 * 1. tabId=0でのTabIdバリデーションエラー(Tab ID must be positive)と全サービス非実行検証
 * 2. tabId=-1でのCurrentTabバリデーションエラー(Tab ID must be positive)と全サービス非実行検証
 * 3. tabId=1.5でのTabIdバリデーションエラー(Tab ID must be an integer)と全サービス非実行検証
 */
describe('HandleContextMenuReplaceDomElement.execute - バリデーションエラー', () => {
  let useCase: HandleContextMenuReplaceDomElement;
  let mockTabsService: IChromeTabsService;
  let mockSelectedPageTextService: ISelectedPageTextService;
  let mockPopupService: IPopupService;

  beforeEach(() => {
    // モックサービスの初期化
    mockTabsService = {
      sendMessage: vi.fn(),
    };

    mockSelectedPageTextService = {
      setSelectedPageText: vi.fn(),
      getSelectedPageText: vi.fn(),
    };

    mockPopupService = {
      openPopup: vi.fn(),
    };

    // テスト対象の初期化
    useCase = new HandleContextMenuReplaceDomElement(
      mockTabsService,
      mockSelectedPageTextService,
      mockPopupService
    );
  });

  it.each([
    {
      description: 'tabId 0の場合は TabId バリデーションエラーが発生する',
      tabId: 0,
      expectedError: 'Tab ID must be positive',
    },
    {
      description: '負のtabIdの場合は CurrentTab のバリデーションエラーが発生する',
      tabId: -1,
      expectedError: 'Tab ID must be positive',
    },
    {
      description: '非整数のtabIdの場合は TabId バリデーションエラーが発生する',
      tabId: 1.5,
      expectedError: 'Tab ID must be an integer',
    },
  ])('$description', async ({ tabId, expectedError }) => {
    // Act & Assert
    await expect(useCase.execute(tabId)).rejects.toThrow(expectedError);
    
    expect(mockTabsService.sendMessage).not.toHaveBeenCalled();
    expect(mockSelectedPageTextService.setSelectedPageText).not.toHaveBeenCalled();
    expect(mockPopupService.openPopup).not.toHaveBeenCalled();
  });
});
