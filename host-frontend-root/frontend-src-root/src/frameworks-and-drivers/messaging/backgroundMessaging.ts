import { defineExtensionMessaging } from '@webext-core/messaging';

/**
 * Background Script用メッセージングプロトコル定義
 * @webext-core/messagingを使用した型安全なメッセージング
 *
 * ADR-002に従い、既存のchrome.runtime.sendMessage/onMessageの代わりに
 * @webext-core/messagingを使用してメッセージングを統一
 */

/**
 * メッセージプロトコルの型定義
 * key: メッセージタイプ
 * value: [引数の型, 戻り値の型]
 */
interface BackgroundMessagingProtocol {
  /**
   * すべてのルールを取得
   * @returns ルール配列を含む成功レスポンス、またはエラーレスポンス
   */
  getAllRules: () => GetAllRulesResponse;

  /**
   * Content Scriptにルール適用メッセージを転送
   * @param data tabId と tabUrl を含むオブジェクト
   * @returns 成功レスポンス、またはエラーレスポンス
   */
  applyAllRules: (data: ApplyAllRulesRequest) => ApplyAllRulesResponse;
}

/**
 * getAllRulesのレスポンス型
 */
export interface GetAllRulesResponse {
  success: boolean;
  rules?: any[];
  error?: string;
}

/**
 * applyAllRulesのリクエスト型
 */
export interface ApplyAllRulesRequest {
  tabId: number;
  tabUrl: string;
}

/**
 * applyAllRulesのレスポンス型
 */
export interface ApplyAllRulesResponse {
  success: boolean;
  response?: any;
  error?: string;
}

/**
 * Background Script用メッセージング
 * - sendMessage: 他のコンテキストからBackground Scriptにメッセージを送信
 * - onMessage: Background Scriptでメッセージを受信
 */
export const backgroundMessaging = defineExtensionMessaging<BackgroundMessagingProtocol>();
