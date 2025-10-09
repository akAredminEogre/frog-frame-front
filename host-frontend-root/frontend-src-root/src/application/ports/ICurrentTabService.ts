import { Tab } from 'src/domain/value-objects/Tab';
import { TabId } from 'src/domain/value-objects/TabId';

export interface ICurrentTabService {
  getCurrentTab(): Promise<Tab>;
  getTabById(tabId: TabId): Promise<Tab>;
}
