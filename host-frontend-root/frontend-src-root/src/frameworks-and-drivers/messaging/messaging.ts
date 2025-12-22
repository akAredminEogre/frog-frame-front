import { defineExtensionMessaging } from '@webext-core/messaging';

/**
 * Background Script へのメッセージプロトコル定義
 * Content Script, Popup から Background へ送信するメッセージ
 */
export interface BackgroundProtocolMap {
  /**
   * 全ルールを取得する
   * Content Script → Background
   */
  getAllRules(): { success: boolean; rules?: any[]; error?: string };

  /**
   * 全ルールを適用する
   * Popup → Background
   */
  applyAllRules(data: { tabId: number; tabUrl: string }): { success: boolean; response?: any; error?: string };
}

/**
 * Content Script へのメッセージプロトコル定義
 * Background から Content Script へ送信するメッセージ
 */
export interface ContentScriptProtocolMap {
  /**
   * ルールを適用する
   * Background → Content Script
   */
  applyAllRules(): { success: boolean; error?: string };

  /**
   * 要素選択を取得する
   * Background → Content Script
   */
  getElementSelection(): { selection: string };
}

/**
 * Background へのメッセージング
 * sendMessage: Content Script, Popup から Background へ送信
 * onMessage: Background で受信
 */
export const {
  sendMessage: sendToBackground,
  onMessage: onBackgroundMessage,
} = defineExtensionMessaging<BackgroundProtocolMap>();

/**
 * Content Script へのメッセージング
 * sendMessage: Background から Content Script へ送信（tabIdを指定）
 * onMessage: Content Script で受信
 */
export const {
  sendMessage: sendToContentScript,
  onMessage: onContentScriptMessage,
} = defineExtensionMessaging<ContentScriptProtocolMap>();
