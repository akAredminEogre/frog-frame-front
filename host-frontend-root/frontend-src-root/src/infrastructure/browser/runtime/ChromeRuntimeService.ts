import { CurrentTab } from 'src/domain/value-objects/CurrentTab';
import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';

export class ChromeRuntimeService implements IChromeRuntimeService {
  async sendApplyRewriteRuleMessage(currentTab: CurrentTab): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise<void>((resolve) => {
        chrome.runtime.sendMessage(
          {
            type: 'applyAllRules',
            currentTab: {
              tabId: currentTab.tabId
            }
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
