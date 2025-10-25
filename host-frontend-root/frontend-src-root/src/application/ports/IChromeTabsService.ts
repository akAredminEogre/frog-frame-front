import { Tab } from 'src/domain/value-objects/Tab';
import { Tabs } from 'src/domain/value-objects/Tabs';

export interface IChromeTabsService {
  sendMessage(tabId: number, message: any): Promise<any>;
  queryTabs(queryInfo: any): Promise<Tabs>;
  sendApplyAllRulesMessage(tab: Tab): Promise<any>;
  openEditPage(ruleId: string): Promise<void>;
  reloadTab(tab: Tab): Promise<void>;
}
