/**
 * 特定のタブに対してリライトルールを適用するUseCase
 */
export class ApplyRewriteRuleToTabUseCase {
  async execute(
    targetTabId: number, 
    rule: { urlPattern?: string }
  ): Promise<{ success: boolean; error?: string; reason?: string; response?: any }> {
    try {
      // タブ情報を取得
      const tab = await new Promise<chrome.tabs.Tab>((resolve, reject) => {
        chrome.tabs.get(targetTabId, (tab) => {
          if (chrome.runtime.lastError) {
            console.error(`[ApplyRewriteRuleToTab] Failed to get tab ${targetTabId}:`, chrome.runtime.lastError);
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(tab);
        });
      });

      if (!tab.url) {
        console.error(`[ApplyRewriteRuleToTab] Tab ${targetTabId} has no URL`);
        return { success: false, error: 'Tab has no URL' };
      }

      // URLパターンをチェック
      const { urlPattern } = rule;
      if (urlPattern && !tab.url.startsWith(urlPattern)) {
        return { success: false, reason: 'URL pattern mismatch' };
      }

      // コンテンツスクリプトにメッセージを送信して、全ルールの適用を依頼
      const response = await new Promise<any>((resolve, reject) => {
        chrome.tabs.sendMessage(targetTabId, { type: 'applyAllRules' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(`[ApplyRewriteRuleToTab] Failed to send message to tab ${targetTabId}:`, chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(response);
        });
      });

      return { success: true, response };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }
}
