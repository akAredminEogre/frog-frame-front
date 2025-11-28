/**
 * ブラウザのLocation APIを抽象化するインフラストラクチャサービス。
 * window.locationへの直接アクセスを避け、テスト容易性を向上させます。
 */
export class WindowLocationService {
  /**
   * 現在のページのURLを取得します。
   * @returns 現在のページの完全なURL文字列。
   */
  public getCurrentUrl(): string {
    return window.location.href;
  }
}
