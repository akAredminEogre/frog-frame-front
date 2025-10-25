import { inject, injectable } from 'tsyringe';

import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { IPopupService } from 'src/application/ports/IPopupService';
import { ISelectedPageTextService } from 'src/application/ports/ISelectedPageTextService';

/**
 * コンテキストメニューからのDOM要素置換処理を扱うユースケース
 */
@injectable()
export class HandleContextMenuReplaceDomElement {
  constructor(
    @inject('IChromeTabsService') private readonly tabsService: IChromeTabsService,
    @inject('ISelectedPageTextService') private readonly selectedPageTextService: ISelectedPageTextService,
    @inject('IPopupService') private readonly popupService: IPopupService
  ) { }
  
  /**
   * コンテキストメニュー選択時の処理
   * @param tabId 対象タブのID
   * @returns Promise<void>
   */
  async execute(tabId: number): Promise<void> {    
    const response = await this.tabsService.sendMessage(tabId, { type: 'getElementSelection' });

    await this.saveSelectionAndOpenPopup(response.selection);
  }


  /**
   * 選択内容をストレージに保存してポップアップを開く
   */
  private async saveSelectionAndOpenPopup(selection: string): Promise<void> {
    await this.selectedPageTextService.setSelectedPageText(selection);
    await this.popupService.openPopup();
  }
}
