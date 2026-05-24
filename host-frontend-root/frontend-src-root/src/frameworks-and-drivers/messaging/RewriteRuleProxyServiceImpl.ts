import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { container } from 'src/frameworks-and-drivers/di/container';
import { IRewriteRuleProxyService } from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyService';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';

/**
 * RewriteRuleProxyService の実装を作成
 * container を使用してリポジトリを解決し、ルールを取得する
 *
 * Background Script専用: このファイルは container に依存するため、
 * Content Script からはインポートしないこと
 */
export function createRewriteRuleProxyServiceImpl(): IRewriteRuleProxyService {
  return {
    async getAllRules() {
      const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
      const rules = await repository.getAll();

      return rules.toArray().map((rule) => RewriteRuleMapper.toDto(rule));
    },

    async deleteRule(id: number) {
      const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
      await repository.delete(id);
    },
  };
}
