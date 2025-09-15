export interface ISelectedPageTextService {
  setSelectedPageText(text: string): Promise<void>;
  getSelectedPageText(): Promise<string>;
}
