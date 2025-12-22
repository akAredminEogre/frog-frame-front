import { defineProxyService } from '@webext-core/proxy-service';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { container } from 'src/frameworks-and-drivers/di/container';

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
 * @webext-core/messaging と同じエコシステムのため、共存可能
 */
function createRewriteRuleProxyService(): IRewriteRuleProxyService {
  return {
    async getAllRules() {
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
