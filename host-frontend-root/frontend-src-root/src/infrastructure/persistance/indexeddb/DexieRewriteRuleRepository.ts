import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { dexieDatabase, RewriteRuleSchema } from './DexieDatabase';

/**
 * Dexie.js (IndexedDB) を使用したRewriteRuleリポジトリの実装
 * Clean Architectureのインフラストラクチャ層に配置
 * RewriteRuleの永続化をIndexedDBで提供
 * IRewriteRuleRepositoryインターフェースを実装
 *
 * ID型について:
 * - DB層: number型の自動採番ID
 * - Domain層: number型のID
 * - Repository層では型変換不要
 */
export class DexieRewriteRuleRepository implements IRewriteRuleRepository {
  private readonly database = dexieDatabase;

  /**
   * 新しいルールを作成する
   * @param rule 作成するRewriteRule
   *
   * 注意: DB側で自動採番されたnumber型のIDを使用する
   * RewriteRuleのnumber型IDは無視される
   */
  async create(rule: RewriteRule): Promise<void> {
    const schema = this.convertToSchemaForCreate(rule);
    await this.database.rewriteRules.add(schema);
  }

  /**
   * 既存のルールを更新する
   * @param rule 更新するRewriteRule
   *
   * 注意: RewriteRuleのnumber型IDをそのまま使用してDB検索を行う
   */
  async update(rule: RewriteRule): Promise<void> {
    const schema = this.convertToSchemaForUpdate(rule);
    await this.database.rewriteRules.put(schema);
  }

  /**
   * すべてのルールを取得する
   * @returns RewriteRulesオブジェクト
   */
  async getAll(): Promise<RewriteRules> {
    try {
      const rulesObject: Record<string, RewriteRule> = {};

      await this.database.rewriteRules.each(schema => {
        const rule = this.convertSchemaToRule(schema);
        rulesObject[rule.id] = rule;
      });

      return new RewriteRules(rulesObject);
    } catch (error) {
      console.error('[DexieRewriteRuleRepository] Error in getAll():', error);
      throw error;
    }
  }

  /**
   * IDで指定されたルールを取得する（IndexedDBから直接取得）
   * @param id 検索するルールのID（number型）
   * @returns RewriteRuleオブジェクト
   * @throws {RewriteRuleNotFoundError} ルールが見つからない場合
   *
   * 注意: number型のIDをそのまま使用してDB検索を行う
   */
  async getById(id: number): Promise<RewriteRule> {
    const schema = await this.database.rewriteRules.get(id);

    if (!schema) {
      throw new RewriteRuleNotFoundError(id);
    }

    return this.convertSchemaToRule(schema);
  }

  /**
   * RewriteRuleをRewriteRuleSchemaに変換する（新規作成用）
   * @param rule 変換元のRewriteRule
   * @returns 変換されたRewriteRuleSchema（idフィールドなし - DB側で自動採番）
   */
  private convertToSchemaForCreate(rule: RewriteRule): RewriteRuleSchema {
    return {
      oldString: rule.oldString,
      newString: rule.newString,
      urlPattern: rule.urlPattern,
      isRegex: rule.isRegex
    };
  }

  /**
   * RewriteRuleをRewriteRuleSchemaに変換する（更新用）
   * @param rule 変換元のRewriteRule
   * @returns 変換されたRewriteRuleSchema（number型のidをそのまま使用）
   */
  private convertToSchemaForUpdate(rule: RewriteRule): RewriteRuleSchema {
    return {
      id: rule.id,
      oldString: rule.oldString,
      newString: rule.newString,
      urlPattern: rule.urlPattern,
      isRegex: rule.isRegex
    };
  }

  /**
   * RewriteRuleSchemaをRewriteRuleに変換する
   * @param schema 変換元のRewriteRuleSchema
   * @returns 変換されたRewriteRule（number型のidをそのまま使用）
   */
  private convertSchemaToRule(schema: RewriteRuleSchema): RewriteRule {
    return new RewriteRule(
      schema.id!,
      schema.oldString,
      schema.newString,
      schema.urlPattern,
      schema.isRegex
    );
  }

}
