import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';

/**
 * ルール編集ページを開くユースケース
 */
export class OpenRuleEditPageUseCase {
  constructor(
    private readonly chromeTabsService: IChromeTabsService
  ) {}

  /**
   * 指定されたruleIdの編集ページを新しいタブで開く
   */
  async execute(ruleId: string | number): Promise<void> {
    try {
      await this.chromeTabsService.openEditPage(String(ruleId));
    } catch (err) {
      console.error('編集ページを開く際にエラーが発生しました:', err);
      throw err;
    }
  }
}
