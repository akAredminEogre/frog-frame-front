import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';
import { SelectedPageText } from 'src/domain/value-objects/SelectedPageText';

export class SelectedPageTextRepository implements ISelectedPageTextRepository {
  private readonly storageKey = 'selectedPageText';

  async setSelectedPageText(text: string): Promise<void> {
    if (text === undefined || text === null) {
      throw new Error('Text cannot be undefined or null');
    }
    await chrome.storage.local.set({ [this.storageKey]: text });
  }

  async getSelectedPageText(): Promise<SelectedPageText> {
    const result = await chrome.storage.local.get(this.storageKey);
    const text = result[this.storageKey];
    
    if (text && typeof text === 'string') {
      return new SelectedPageText(text);
    }
    
    return new SelectedPageText('');
  }


  async getSelectedPageTextAndRemove(): Promise<SelectedPageText> {
    const result = await chrome.storage.local.get(this.storageKey);
    const text = result[this.storageKey];
    
    // Remove the text after getting it
    await chrome.storage.local.remove(this.storageKey);
    
    if (text && typeof text === 'string') {
      return new SelectedPageText(text);
    }
    
    return new SelectedPageText('');
  }
}