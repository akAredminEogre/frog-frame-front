import { CurrentTab } from 'src/domain/value-objects/CurrentTab';

export interface IChromeRuntimeService {
  sendApplyRewriteRuleMessage(currentTab: CurrentTab): Promise<{ success: boolean; error?: string }>;
}
