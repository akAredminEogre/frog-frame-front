import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { sendToBackground } from 'src/frameworks-and-drivers/messaging/messaging';

/**
 * Chrome Runtime Messaging を使用したRewriteRuleリポジトリの実装
 * Content Script用: IndexedDBの代わりにBackground Scriptとのメッセージングでデータアクセス
 * Clean Architectureのインフラストラクチャ層に配置
 * IRewriteRuleRepositoryインターフェースを実装
 *
 * @webext-core/messaging を使用してBackground Scriptと通信する
 */
export class ChromeRuntimeRewriteRuleRepository implements IRewriteRuleRepository {

  /**
   * すべてのルールを取得する
   * @webext-core/messaging 経由でBackground ScriptからIndexedDBデータを取得
   * @returns RewriteRulesオブジェクト
   */
  async getAll(): Promise<RewriteRules> {
    try {
      const response = await sendToBackground('getAllRules', undefined);

      if (!response.success) {
        console.error('[ChromeRuntimeRewriteRuleRepository] Background script returned error:', response.error);
        throw new Error(`Failed to get rules from background: ${response.error}`);
      }

      const rulesObject: Record<string, RewriteRule> = {};

      response.rules?.forEach((ruleData: any) => {
        const rule = new RewriteRule(
          ruleData.id,
          ruleData.oldString,
          ruleData.newString,
          ruleData.urlPattern,
          ruleData.isRegex
        );

        rulesObject[rule.id] = rule;
      });

      return new RewriteRules(rulesObject);
    } catch (error) {
      console.error('[ChromeRuntimeRewriteRuleRepository] Error in getAll():', error);
      throw error;
    }
  }

  /**
   * 新しいルールを作成する
   * Content Scriptでは作成操作は使用しないため、エラーをthrow
   * @param _rule 作成するRewriteRule
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  async create(_rule: RewriteRule): Promise<void> {
    throw new Error('ChromeRuntimeRewriteRuleRepository does not support create operation in content script context');
  }

  /**
   * 既存のルールを更新する
   * Content Scriptでは更新操作は使用しないため、エラーをthrow
   * @param _rule 更新するRewriteRule
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  async update(_rule: RewriteRule): Promise<void> {
    throw new Error('ChromeRuntimeRewriteRuleRepository does not support update operation in content script context');
  }

  /**
   * IDで指定されたルールを取定取得する
   * Content Scriptでは個別取得は使用しないため、エラーをthrow
   * @param id 検索するルールのID
   */
  async getById(id: number): Promise<RewriteRule> {
    throw new RewriteRuleNotFoundError(id);
  }

  /**
   * 指定されたURLにマッチするルールを取得する
   * @param currentUrl 現在のURL
   * @returns urlPatternがcurrentUrlの前方一致となるルールのRewriteRulesオブジェクト
   */
  async getRulesMatchingUrl(currentUrl: string): Promise<RewriteRules> {
    const allRules = await this.getAll();
    const matchingRules = allRules.toArray().filter((rule) => rule.matchesUrl(currentUrl));

    const rulesObject: Record<string, RewriteRule> = {};
    matchingRules.forEach((rule) => {
      rulesObject[rule.id] = rule;
    });

    return new RewriteRules(rulesObject);
  }
}
