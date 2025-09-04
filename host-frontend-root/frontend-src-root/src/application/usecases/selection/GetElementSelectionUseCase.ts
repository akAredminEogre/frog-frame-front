import { ElementSelector } from 'src/domain/entities/ElementSelector';
import { SelectionService } from 'src/infrastructure/selection/SelectionService';

/**
 * 要素選択情報を取得するユースケース
 */
export class GetElementSelectionUseCase {
  private elementSelector: ElementSelector;
  private selectionService: SelectionService;

  constructor(selectionService?: SelectionService) {
    this.elementSelector = new ElementSelector();
    this.selectionService = selectionService || new SelectionService();
  }

  /**
   * 選択されたテキストを含む最小のHTML要素を特定する
   * @returns 選択された要素の情報
   */
  getElementSelectionInfo(): { selection: string } {
    const range = this.selectionService.getFirstRange();
    const selectedText = this.selectionService.getSelectedText();

    return {
      selection: this.elementSelector.getElementFromSelection(range, selectedText)
    };
  }
}
