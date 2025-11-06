import { SelectedPageText } from 'src/domain/value-objects/SelectedPageText';

export interface ISelectedPageTextRepository {
  setSelectedPageText(text: string): Promise<void>;
  getSelectedPageText(): Promise<SelectedPageText>;
  getSelectedPageTextAndRemove(): Promise<SelectedPageText>;
}