import { Tab } from 'src/domain/value-objects/Tab';

export interface IChromeRuntimeService {
  sendApplyRewriteRuleMessage(currentTab: Tab): Promise<{ success: boolean; error?: string }>;
}
