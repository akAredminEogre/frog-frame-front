import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

export class ChromeStorageRewriteRuleRepository implements IRewriteRuleRepository {
  async save(rule: RewriteRule): Promise<void> {
    await chrome.storage.local.set({ [rule.id]: rule });
  }
}
