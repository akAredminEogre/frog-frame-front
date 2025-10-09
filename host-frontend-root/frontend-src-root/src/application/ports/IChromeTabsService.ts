import { Tab } from 'src/domain/value-objects/Tab';

export interface IChromeTabsService {
  sendMessage(tabId: number, message: any): Promise<any>;
  queryTabs(queryInfo: any): Promise<Tab[]>;
}
