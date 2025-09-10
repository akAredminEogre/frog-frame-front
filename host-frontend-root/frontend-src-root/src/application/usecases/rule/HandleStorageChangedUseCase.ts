/**
 * ストレージ変更時にアクティブなタブにルールを再適用するUseCase
 */
export class HandleStorageChangedUseCase {
  /**
   * ストレージ変更時の処理を実行
   * @param changes 変更されたストレージの内容
   * @param namespace ストレージの名前空間
   */
  async execute(changes: { [key: string]: chrome.storage.StorageChange }, namespace: string): Promise<void> {
    if (namespace === 'local') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          // アクティブなタブに全ルール適用を依頼
          chrome.tabs.sendMessage(currentTab.id, { type: 'applyAllRules' })
            .catch(() => { /* エラーは無視 */ });
        }
      });
    }
  }
}
