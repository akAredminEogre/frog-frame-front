export interface Tab {
  id?: number;
  url?: string;
}

export interface IChromeTabsService {
  sendMessage(tabId: number, message: any): Promise<any>;
  queryTabs(queryInfo: any): Promise<Tab[]>;
}
