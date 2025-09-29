import { TabId } from 'src/domain/value-objects/TabId';
import { TabUrl } from 'src/domain/value-objects/TabUrl';

export interface IChromeRuntimeService {
  sendApplyRewriteRuleMessage(tabId: TabId, tabUrl: TabUrl): Promise<{ success: boolean; error?: string }>;
}
