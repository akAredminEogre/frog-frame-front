import { IGetSelectionService } from 'src/application/ports/IGetSelectionService';
import { ElementSelector } from 'src/domain/entities/ElementSelector';
import { GetSelectionService } from 'src/infrastructure/windows/getSelectionService';

/**
 * 要素選択情報を取得するユースケース
 */
export class GetElementSelectionUseCase {
  private elementSelector: ElementSelector;
  private selectionService: IGetSelectionService;

  constructor(selectionService?: IGetSelectionService) {
    this.elementSelector = new ElementSelector();
    this.selectionService = selectionService || new GetSelectionService();
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
