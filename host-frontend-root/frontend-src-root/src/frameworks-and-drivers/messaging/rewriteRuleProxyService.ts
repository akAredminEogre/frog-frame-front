/**
 * RewriteRuleMessagingServiceのプロキシサービス定義
 *
 * @webext-core/proxy-serviceを使用してBackground ScriptとContent Script/Popup間の
 * メッセージングを抽象化する。
 *
 * 使用方法:
 * - Background Script: registerRewriteRuleMessagingService()を呼び出してサービスを登録
 * - 他のコンテキスト: getRewriteRuleMessagingService()でプロキシを取得してメソッドを呼び出す
 */
import { defineProxyService } from '@webext-core/proxy-service';

import {
  getRepositoryFactory,
  RewriteRuleMessagingService
} from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';

/**
 * proxy-serviceとしてのRewriteRuleMessagingServiceの定義
 * registerRewriteRuleMessagingService: Background Scriptで呼び出してサービスを登録
 * getRewriteRuleMessagingService: 他のコンテキストからサービスを取得
 */
export const [registerRewriteRuleMessagingService, getRewriteRuleMessagingService] =
  defineProxyService('RewriteRuleMessagingService', () => {
    const repository = getRepositoryFactory()();
    return new RewriteRuleMessagingService(repository);
  });
