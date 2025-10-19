import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { dexieDatabase, RewriteRuleSchema } from './DexieDatabase';

/**
 * Dexie.js (IndexedDB) を使用したRewriteRuleリポジトリの実装
 * Clean Architectureのインフラストラクチャ層に配置
 * RewriteRuleの永続化をIndexedDBで提供
 * Dexie.js APIを直接活用した実装
 *
 * 注意: 現時点では IRewriteRuleRepository を実装していません。
 * これは既存の ChromeStorageRewriteRuleRepository への影響を最小化し、
 * DexieRewriteRuleRepository 特有の実装に集中するためです。
 * 将来的には IRewriteRuleRepository を実装する予定です。
 *
 * ID型の変換について:
 * - DB層: number型の自動採番ID
 * - Domain層: string型のID（既存の互換性維持のため）
 * - Repository層で相互変換を実施
 */
export class DexieRewriteRuleRepository {
  private readonly database = dexieDatabase;

  /**
   * 新しいルールを作成する
   * @param rule 作成するRewriteRule
   *
   * 注意: DB側で自動採番されたnumber型のIDを使用する
   * RewriteRuleのstring型IDは無視される
   */
  async create(rule: RewriteRule): Promise<void> {
    const schema = this.convertToSchemaForCreate(rule);
    await this.database.rewriteRules.add(schema);
  }

  /**
   * 既存のルールを更新する
   * @param rule 更新するRewriteRule
   *
   * 注意: RewriteRuleのstring型IDをnumber型に変換してDB検索を行う
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
    const rulesObject: Record<string, RewriteRule> = {};

    await this.database.rewriteRules.each(schema => {
      const rule = this.convertSchemaToRule(schema);
      rulesObject[rule.id] = rule;
    });

    return new RewriteRules(rulesObject);
  }

  /**
   * IDで指定されたルールを取得する（IndexedDBから直接取得）
   * @param id 検索するルールのID（string型またはnumber型）
   * @returns RewriteRuleオブジェクト
   * @throws {RewriteRuleNotFoundError} ルールが見つからない場合
   *
   * 注意: string型またはnumber型のIDをnumber型に変換してDB検索を行う
   */
  async getById(id: string | number): Promise<RewriteRule> {
    const numericId = this.convertStringIdToNumber(id);
    const schema = await this.database.rewriteRules.get(numericId);

    if (!schema) {
      throw new RewriteRuleNotFoundError(String(id));
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
   * @returns 変換されたRewriteRuleSchema（string型のidをnumber型に変換）
   */
  private convertToSchemaForUpdate(rule: RewriteRule): RewriteRuleSchema {
    return {
      id: this.convertStringIdToNumber(rule.id),
      oldString: rule.oldString,
      newString: rule.newString,
      urlPattern: rule.urlPattern,
      isRegex: rule.isRegex
    };
  }

  /**
   * RewriteRuleSchemaをRewriteRuleに変換する
   * @param schema 変換元のRewriteRuleSchema
   * @returns 変換されたRewriteRule（number型のidをstring型に変換）
   */
  private convertSchemaToRule(schema: RewriteRuleSchema): RewriteRule {
    return new RewriteRule(
      this.convertNumberIdToString(schema.id!),
      schema.oldString,
      schema.newString,
      schema.urlPattern,
      schema.isRegex
    );
  }

  /**
   * string型またはnumber型のIDをnumber型に変換する
   * @param id string型またはnumber型のID
   * @returns number型のID
   * @throws {Error} IDが数値に変換できない場合
   */
  private convertStringIdToNumber(id: string | number): number {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new Error(`Invalid ID format: ${id}. Expected a numeric string or number.`);
    }
    return numericId;
  }

  /**
   * number型のIDをstring型に変換する
   * @param id number型のID
   * @returns string型のID
   */
  private convertNumberIdToString(id: number): string {
    return String(id);
  }
}
