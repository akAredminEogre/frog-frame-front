import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';
import { Tab } from 'src/domain/value-objects/Tab';

export class ChromeRuntimeService implements IChromeRuntimeService {
  async sendApplyRewriteRuleMessage(currentTab: Tab): Promise<{ success: boolean; error?: string }> {
    try {
      const tabId = currentTab.getTabId();
      const tabUrl = currentTab.getTabUrl();
      
      await new Promise<void>((resolve) => {
        chrome.runtime.sendMessage(
          {
            type: 'applyAllRules',
            tabId: tabId.value,
            tabUrl: tabUrl.value
          },
          () => {
            // エラーは無視して処理を続行
            resolve();
          }
        );
      });

      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }
}
