import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { Tab } from 'src/domain/value-objects/Tab';
import { TabId } from 'src/domain/value-objects/TabId';

/**
 * Content script用のCurrentTabService実装
 * Content scriptではchrome.tabs APIが使用できないため、
 * window.location.hrefを使用してURLを取得する
 */
export class ContentCurrentTabService implements ICurrentTabService {
  private static readonly CONTENT_SCRIPT_TAB_ID = 1;

  async getCurrentTab(): Promise<Tab> {
    const currentUrl = window.location.href;
    return new Tab(ContentCurrentTabService.CONTENT_SCRIPT_TAB_ID, currentUrl);
  }

  async getTabById(tabId: TabId): Promise<Tab> {
    throw new Error(`getTabById(${tabId.value}) is not supported in content scripts`);
  }
}
