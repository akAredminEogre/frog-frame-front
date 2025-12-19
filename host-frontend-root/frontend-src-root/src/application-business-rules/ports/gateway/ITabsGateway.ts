/**
 * ブラウザタブ操作のGatewayインターフェース
 */
export interface ITabsGateway {
  /**
   * 指定されたURLパターンにマッチするタブをリロードする
   * @param urlPattern URLパターン
   */
  reloadMatchingTabs(urlPattern: string): Promise<void>;
}
