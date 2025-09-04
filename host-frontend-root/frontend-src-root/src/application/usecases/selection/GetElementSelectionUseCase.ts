import { ElementSelector } from 'src/domain/entities/ElementSelector';

/**
 * 要素選択情報を取得するユースケース
 */
export class GetElementSelectionUseCase {
  private elementSelector: ElementSelector;

  constructor() {
    this.elementSelector = new ElementSelector();
  }

  /**
   * 選択されたテキストを含む最小のHTML要素を特定する
   * @returns 選択された要素の情報
   */
  getElementSelectionInfo(): { selection: string } {
    return { selection: this.elementSelector.getElementFromSelection() };
  }
}
