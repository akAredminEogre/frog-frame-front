import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';

interface PopupInitFormResult {
  selectedText: string;
  urlPattern: string;
}

/**
 * ポップアップのフォーム初期化を行うUseCase
 * 右クリック選択テキストと現在のタブのoriginを取得してフォームを初期化する
 */
export class PopupInitFormUseCase {
  constructor(
    private currentTabService: ICurrentTabService,
    private selectedPageTextRepository: ISelectedPageTextRepository
  ) {}

  async execute(): Promise<PopupInitFormResult> {
    const selectedPageText = await this.selectedPageTextRepository.getSelectedPageTextAndRemove();
    const selectedTextValue = selectedPageText.toString();

    const currentTab = await this.currentTabService.getCurrentTab();
    const tabUrl = currentTab.getTabUrl();
    const originString = tabUrl.tabOrigin;

    return {
      selectedText: selectedTextValue,
      urlPattern: originString
    };
  }
}