import { TabId } from 'src/domain/value-objects/TabId';

export interface IChromeRuntimeService {
  sendApplyRewriteRuleMessage(tabId: TabId): Promise<{ success: boolean; error?: string }>;
}
