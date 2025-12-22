export interface IChromeRuntimeService {
  sendApplyRewriteRuleMessage(tabId: number, tabUrl: string): Promise<{ success: boolean; error?: string }>;
}
