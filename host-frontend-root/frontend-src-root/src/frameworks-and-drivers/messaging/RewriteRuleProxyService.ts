import { defineProxyService } from '@webext-core/proxy-service';

/**
 * RewriteRule取得用のプロキシサービスインターフェース
 * Content Script から Background へのルール取得に使用
 */
export interface IRewriteRuleProxyService {
  /**
   * 全ルールを取得する
   * @returns ルールデータの配列
   */
  getAllRules(): Promise<Array<{
    id: number;
    oldString: string;
    newString: string;
    urlPattern: string;
    isRegex: boolean;
  }>>;
}

/**
 * サービス実装の格納場所
 * background.ts から setRewriteRuleProxyServiceImpl() で注入される
 */
let serviceImpl: IRewriteRuleProxyService | null = null;

/**
 * サービス実装を注入する
 * background.ts の main() 内で registerRewriteRuleProxyService() の前に呼び出す
 *
 * @param impl サービス実装
 */
export function setRewriteRuleProxyServiceImpl(impl: IRewriteRuleProxyService): void {
  serviceImpl = impl;
}

/**
 * @webext-core/proxy-service を使用したRewriteRuleプロキシサービス
 * Background Script で実行され、Content Script からのルール取得を仲介
 *
 * 重要: このファイルは container.ts に依存しない
 * 実装は background.ts から setRewriteRuleProxyServiceImpl() で注入される
 * これにより Content Script でこのモジュールがロードされても問題が発生しない
 */
function createRewriteRuleProxyService(): IRewriteRuleProxyService {
  if (!serviceImpl) {
    throw new Error(
      'RewriteRuleProxyService implementation not set. ' +
      'Call setRewriteRuleProxyServiceImpl() before registerRewriteRuleProxyService().'
    );
  }
  return serviceImpl;
}

export const [registerRewriteRuleProxyService, getRewriteRuleProxyService] =
  defineProxyService('RewriteRuleProxyService', createRewriteRuleProxyService);
