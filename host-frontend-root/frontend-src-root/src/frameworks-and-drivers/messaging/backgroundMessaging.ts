import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';

/**
 * Background Script用メッセージング型定義
 *
 * chrome.runtime.sendMessage/onMessageで使用するメッセージの型を定義
 * Content Script と Popup から Background Script へのメッセージングで使用
 */

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

