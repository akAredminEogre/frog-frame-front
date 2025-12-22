import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';
import { Tab } from 'src/domain/value-objects/Tab';
import { sendToBackground } from 'src/frameworks-and-drivers/messaging/messaging';

/**
 * Chrome Runtime Service
 * @webext-core/messaging を使用してBackground Scriptと通信する
 */
export class ChromeRuntimeService implements IChromeRuntimeService {
  async sendApplyRewriteRuleMessage(currentTab: Tab): Promise<{ success: boolean; error?: string }> {
    try {
      const tabId = currentTab.getTabId();
      const tabUrl = currentTab.getTabUrl();

      await sendToBackground('applyAllRules', {
        tabId: tabId.value,
        tabUrl: tabUrl.value,
      });

      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }
}
