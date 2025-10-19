import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';
import { SelectedPageText } from 'src/domain/value-objects/SelectedPageText';

export class SelectedPageTextRepository implements ISelectedPageTextRepository {
  private readonly storageKey = 'selectedPageText';

  async getSelectedPageText(): Promise<SelectedPageText> {
    const result = await chrome.storage.local.get(this.storageKey);
    const text = result[this.storageKey];
    
    if (text && typeof text === 'string') {
      return new SelectedPageText(text);
    }
    
    return new SelectedPageText('');
  }

  async removeSelectedPageText(): Promise<void> {
    await chrome.storage.local.remove(this.storageKey);
  }
}