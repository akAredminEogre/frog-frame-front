import { CurrentTab } from 'src/domain/value-objects/CurrentTab';
import { TabId } from 'src/domain/value-objects/TabId';

export interface ICurrentTabService {
  getCurrentTab(): Promise<CurrentTab>;
  getTabById(tabId: TabId): Promise<CurrentTab>;
}
