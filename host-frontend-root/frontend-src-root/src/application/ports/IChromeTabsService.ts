import { Tabs } from 'src/domain/value-objects/Tabs';

export interface IChromeTabsService {
  sendMessage(tabId: number, message: any): Promise<any>;
  queryTabs(queryInfo: any): Promise<Tabs>;
}
