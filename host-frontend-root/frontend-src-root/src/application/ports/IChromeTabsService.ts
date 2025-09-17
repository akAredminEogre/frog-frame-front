import { TabId } from 'src/domain/value-objects/TabId';

export interface IChromeTabsService {
  sendMessage(tabId: TabId, message: any): Promise<any>;
}
