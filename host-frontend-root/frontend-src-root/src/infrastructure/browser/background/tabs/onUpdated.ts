import { container } from 'src/infrastructure/di/container';

import { TabId } from 'src/domain/value-objects/TabId';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';

export function tabsOnUpdated() {
  console.log('[DEBUG] tabsOnUpdated: registering listener');
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    console.log('[DEBUG] tabsOnUpdated: event received, tabId=', tabId, 'status=', changeInfo.status);
    if (changeInfo.status === 'complete') {
      console.log('[DEBUG] tabsOnUpdated: status is complete, processing...');
      try {
        // currentTabServiceを使用して特定のタブ情報を取得
        const currentTabService = container.resolve(ChromeCurrentTabService);
        const chromeTabsService = container.resolve(ChromeTabsService);
        const currentTab = await currentTabService.getTabById(new TabId(tabId));
        console.log('[DEBUG] tabsOnUpdated: got tab info, url=', currentTab.getTabUrl().value);

        // コンテンツスクリプトを注入できるURLかチェック
        if (!currentTab.getTabUrl().canInjectContentScript()) {
          // chrome://などの制限されたURLには送信しない
          console.log('[DEBUG] tabsOnUpdated: URL cannot inject content script, skipping');
          return;
        }

        console.log('[DEBUG] tabsOnUpdated: calling sendApplyAllRulesMessage');
        chromeTabsService.sendApplyAllRulesMessage(currentTab).catch((error) => {
          console.log('[DEBUG] tabsOnUpdated: sendApplyAllRulesMessage error (ignored):', error);
        });
        console.log('[DEBUG] tabsOnUpdated: sendApplyAllRulesMessage called');
      } catch (error) {
        // タブ情報取得に失敗した場合は無視（タブが存在しない、URLが無効など）
        console.debug('[tabs.onUpdated] Failed to get tab info:', error);
      }
    }
  });
}
