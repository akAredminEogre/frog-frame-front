import { defineExtensionMessaging } from '@webext-core/messaging';

import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';

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
 * value: (引数の型) => 戻り値の型
 *
 * 注意: @webext-core/messagingは内部でPromiseを処理するため、
 * プロトコル定義では同期的な戻り値型を使用
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
  rules?: RewriteRuleDTO[];
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
  response?: unknown;
  error?: string;
}

/**
 * Background Script用メッセージング
 * - sendMessage: 他のコンテキストからBackground Scriptにメッセージを送信
 * - onMessage: Background Scriptでメッセージを受信
 */
export const backgroundMessaging = defineExtensionMessaging<BackgroundMessagingProtocol>();
