export interface IChromeTabsService {
  sendMessage(tabId: number, message: any): Promise<any>;
}
