import { defineProxyService } from '@webext-core/proxy-service';

import type { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';

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
 * @webext-core/proxy-service を使用したRewriteRuleプロキシサービス
 * Background Script で実行され、Content Script からのルール取得を仲介
 *
 * 重要: container.ts は動的インポートを使用
 * これにより Content Script でこのモジュールがロードされても
 * Background 用のコンテナは読み込まれない
 */
function createRewriteRuleProxyService(): IRewriteRuleProxyService {
  return {
    async getAllRules() {
      // 動的インポートでcontainerをロード（Background側でのみ実行される）
      const { container } = await import('src/frameworks-and-drivers/di/container');
      const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
      const rules = await repository.getAll();

      return rules.toArray().map((rule) => ({
        id: rule.id,
        oldString: rule.oldString,
        newString: rule.newString,
        urlPattern: rule.urlPattern,
        isRegex: rule.isRegex,
      }));
    },
  };
}

export const [registerRewriteRuleProxyService, getRewriteRuleProxyService] =
  defineProxyService('RewriteRuleProxyService', createRewriteRuleProxyService);
