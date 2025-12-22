import { Tab } from 'src/domain/value-objects/Tab';
import { Tabs } from 'src/domain/value-objects/Tabs';

export interface IChromeTabsService {
  queryTabs(queryInfo: any): Promise<Tabs>;
  sendApplyAllRulesMessage(tab: Tab): Promise<any>;
  sendGetElementSelectionMessage(tabId: number): Promise<{ selection: string }>;
  openEditPage(ruleId: string): Promise<void>;
  reloadTab(tab: Tab): Promise<void>;
}
