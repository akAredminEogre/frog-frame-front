import { IPopupService } from 'src/application/ports/IPopupService';

export class ChromePopupService implements IPopupService {
  async openPopup(): Promise<void> {
    return new Promise((resolve) => {
      chrome.action.openPopup();
      resolve();
    });
  }
}
