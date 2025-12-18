import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';

/**
 * Chrome Tabs APIを使用したGateway実装（スケルトン実装）
 */
export class ChromeTabsGateway implements ITabsGateway {
  /**
   * 指定されたURLパターンにマッチするタブをリロードする
   * @param urlPattern URLパターン
   */
  async reloadMatchingTabs(urlPattern: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
