import { ISelectedPageTextService } from 'src/application/ports/ISelectedPageTextService';

export class SelectedPageTextService implements ISelectedPageTextService {
  async setSelectedPageText(text: string): Promise<void> {
    if (text === undefined || text === null) {
      throw new Error('Text cannot be undefined or null');
    }
    await chrome.storage.local.set({ selectedPageText: text });
  }

  async getSelectedPageText(): Promise<string> {
    const result = await chrome.storage.local.get(['selectedPageText']);
    const text = result?.selectedPageText;
    
    if (text === undefined || text === null) {
      throw new Error('Selected page text not found');
    }
    
    return text;
  }
}
