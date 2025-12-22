import { IChromeRuntimeService } from 'src/application/ports/IChromeRuntimeService';
import { sendToBackground } from 'src/frameworks-and-drivers/messaging/messaging';

/**
 * Chrome Runtime Service
 * @webext-core/messaging を使用してBackground Scriptと通信する
 */
export class ChromeRuntimeService implements IChromeRuntimeService {
  async sendApplyRewriteRuleMessage(tabId: number, tabUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendToBackground('applyAllRules', {
        tabId,
        tabUrl,
      });

      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }
}
