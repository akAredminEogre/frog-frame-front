import { TabId } from 'src/domain/value-objects/TabId';
import { TabUrl } from 'src/domain/value-objects/TabUrl';
import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';

export class ChromeRuntimeService implements IChromeRuntimeService {
  async sendApplyRewriteRuleMessage(tabId: TabId, tabUrl: TabUrl): Promise<{ success: boolean; error?: string }> {
    try {
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
