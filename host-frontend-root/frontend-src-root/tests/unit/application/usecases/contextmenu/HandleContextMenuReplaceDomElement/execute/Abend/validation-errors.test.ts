import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { ISelectedPageTextService } from 'src/application/ports/ISelectedPageTextService';
import { IPopupService } from 'src/application/ports/IPopupService';

/**
 * 無効なtabIdでのバリデーションエラーと全サービス非実行検証
 * バリデーション規約：詳細なバリデーションロジックではなく、エラー発生時の適切な失敗のみテスト
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
      description: '無効なtabId(0)の場合はバリデーションエラーが発生する',
      tabId: 0,
    }
  ])('$description', async ({ tabId }) => {
    // Act & Assert
    await expect(useCase.execute(tabId)).rejects.toThrow();
    
    expect(mockTabsService.sendMessage).not.toHaveBeenCalled();
    expect(mockSelectedPageTextService.setSelectedPageText).not.toHaveBeenCalled();
    expect(mockPopupService.openPopup).not.toHaveBeenCalled();
  });
});
