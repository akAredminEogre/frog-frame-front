/**
 * 現在アクティブなタブのオリジン（例: "https://www.google.com"）を取得します。
 * @returns {Promise<string | null>} アクティブなタブのオリジン。見つからない場合はnull。
 */
export const getActiveTabOrigin = async (): Promise<string | null> => {
  try {
    // 最後にフォーカスされた通常のウィンドウを取得
    const focusedWindow = await chrome.windows.getLastFocused({
      populate: true,
      windowTypes: ['normal'],
    });

    if (focusedWindow?.tabs) {
      // そのウィンドウ内のアクティブなタブを探す
      const activeTab = focusedWindow.tabs.find((tab) => tab.active);

      if (activeTab?.url) {
        const url = new URL(activeTab.url);
        // http/httpsプロトコルの場合のみオリジンを返す
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          return url.origin;
        }
      }
    }
  } catch (error) {
    console.error('Error getting active tab origin:', error);
  }

  return null;
};
