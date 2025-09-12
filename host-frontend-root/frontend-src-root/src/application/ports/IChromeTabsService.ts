import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

export interface IChromeTabsService {
  sendMessage(currentTab: CurrentTab, message: any): Promise<any>;
}
