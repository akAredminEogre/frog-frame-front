import { IPopupService } from 'src/application/ports/IPopupService';

export class ChromePopupService implements IPopupService {
  async openPopup(): Promise<void> {
    try {
      // chrome.action.openPopup() は Promise を返す場合と返さない場合がある
      // また、ユーザー操作のコンテキストでのみ動作する制限がある
      const result = await chrome.action.openPopup();
      
      // openPopup が undefined を返す場合でも正常とみなす（API の仕様）
      if (result === undefined || result === null) {
        return;
      }
      
      // 結果がある場合はそれを待つ
      await result;
    } catch (error) {
      // ポップアップが既に開いている場合やユーザー操作外から呼ばれた場合
      console.error('Failed to open popup:', error);
      throw new Error(`Failed to open popup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
