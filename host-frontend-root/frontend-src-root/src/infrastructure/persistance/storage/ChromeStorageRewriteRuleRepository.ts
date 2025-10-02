import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

export class ChromeStorageRewriteRuleRepository implements IRewriteRuleRepository {
  private static readonly STORAGE_KEY = 'RewriteRules';

  async save(rule: RewriteRule): Promise<void> {
    // 既存のルール集合を取得
    const existingRules = await this.getAll();
    
    // 新しいルールを追加
    const updatedRules = existingRules.add(rule);
    
    // 全体を保存
    await this.saveRewriteRulesToStorage(updatedRules);
  }

  async getAll(): Promise<RewriteRules> {
    const result = await chrome.storage.local.get([ChromeStorageRewriteRuleRepository.STORAGE_KEY]);
    
    // データが存在する場合はRewriteRulesオブジェクトを返す
    if (result[ChromeStorageRewriteRuleRepository.STORAGE_KEY]) {
      const rulesObject = result[ChromeStorageRewriteRuleRepository.STORAGE_KEY];
      return new RewriteRules(rulesObject);
    }
    
    // データが存在しない場合は空のRewriteRulesを返す
    return new RewriteRules();
  }

  async getById(id: string): Promise<RewriteRule | null> {
    const allRules = await this.getAll();
    const foundRule = allRules.findById(id);
    return foundRule || null;
  }

  async update(rule: RewriteRule): Promise<void> {
    const existingRules = await this.getAll();
    const updatedRules = existingRules.update(rule);
    await this.saveRewriteRulesToStorage(updatedRules);
  }

  private async saveRewriteRulesToStorage(rewriteRules: RewriteRules): Promise<void> {
    await chrome.storage.local.set({
      [ChromeStorageRewriteRuleRepository.STORAGE_KEY]: rewriteRules.toObject()
    });
  }
}
