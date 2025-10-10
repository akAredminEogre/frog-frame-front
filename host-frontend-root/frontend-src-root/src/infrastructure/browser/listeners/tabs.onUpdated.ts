import { container } from 'src/infrastructure/di/container';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { TabId } from 'src/domain/value-objects/TabId';

export function registerTabsOnUpdated() {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
      try {
        // currentTabServiceを使用して特定のタブ情報を取得
        const currentTabService = container.resolve(ChromeCurrentTabService);
        const chromeTabsService = container.resolve(ChromeTabsService);
        const currentTab = await currentTabService.getTabById(new TabId(tabId));
        
        chromeTabsService.sendApplyAllRulesMessage(currentTab).catch(() => { /* コンテンツスクリプト未注入時のエラーは無視 */ });
      } catch (error) {
        // タブ情報取得に失敗した場合は無視（タブが存在しない、URLが無効など）
        console.debug('[tabs.onUpdated] Failed to get tab info:', error);
      }
    }
  });
}
