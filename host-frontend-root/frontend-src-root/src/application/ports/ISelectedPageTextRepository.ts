import { SelectedPageText } from 'src/domain/value-objects/SelectedPageText';

export interface ISelectedPageTextRepository {
  getSelectedPageText(): Promise<SelectedPageText>;
  removeSelectedPageText(): Promise<void>;
}