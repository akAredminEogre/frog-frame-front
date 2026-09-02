import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { createRuleId, isUnassignedRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';
import { dexieDatabase, RewriteRuleSchema } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';

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
    const rulesObject: Record<string, RewriteRule> = {};

    await this.database.rewriteRules.each(schema => {
      const rule = this.convertSchemaToRule(schema);
      rulesObject[rule.id] = rule;
    });

    return new RewriteRules(rulesObject);
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
   * 指定されたURLにマッチするルールを取得する
   * @param currentUrl 現在のURL
   * @returns urlPatternがcurrentUrlの前方一致となるルールのRewriteRulesオブジェクト
   */
  async getRulesMatchingUrl(currentUrl: string): Promise<RewriteRules> {
    const schemas = await this.database.rewriteRules
      .filter(schema => schema.isActive && currentUrl.startsWith(schema.urlPattern) && schema.urlPattern !== '')
      .toArray();

    const rulesObject: Record<string, RewriteRule> = {};
    schemas.forEach(schema => {
      const rule = this.convertSchemaToRule(schema);
      rulesObject[rule.id] = rule;
    });

    return new RewriteRules(rulesObject);
  }

  /**
   * 指定されたIDのルールを削除する（物理削除）
   * @param id 削除するルールのID
   *
   * 注意: Dexie.jsのdelete()は存在しないIDでも例外をスローしない（冪等性）
   */
  async delete(id: number): Promise<void> {
    await this.database.rewriteRules.delete(id);
  }

  /**
   * 全ルールをアトミックに置換する
   * Dexie.jsのトランザクション内で全削除→全作成を実行するため、
   * 途中でエラーが発生した場合は自動的にロールバックされる
   *
   * ID採用ルール（リストアユースケース）:
   * - id有り: RewriteRuleのIDをそのまま保持して投入する（clear()後のbulkAddのため衝突しない）
   * - id無し（UNASSIGNED_RULE_ID）: 採番済IDの最大値+1から連番を明示割当する
   *   （DB側の自動採番に委ねると安全整数範囲外のIDが採番されうるため。詳細は
   *   convertToSchemasForRestore を参照）
   * @param rules 新規に設定するRewriteRuleの配列
   */
  async replaceAll(rules: RewriteRule[]): Promise<void> {
    await this.database.transaction('rw', this.database.rewriteRules, async () => {
      await this.database.rewriteRules.clear();
      const schemas = this.convertToSchemasForRestore(rules);
      await this.database.rewriteRules.bulkAdd(schemas);
    });
  }

  /**
   * リストア用にRewriteRule配列をRewriteRuleSchema配列へ変換する
   * id採番済ルールはIDを保持し、未採番ルールには採番済IDの最大値+1から連番を明示割当する。
   *
   * DB側の自動採番に委ねない理由:
   * IndexedDBのキージェネレータは明示キー投入時にそのキーより大きい値へ更新されるため、
   * 採番済IDが安全整数の上限(Number.MAX_SAFE_INTEGER = 2^53-1)付近だと、後続の未採番ルールに
   * 安全整数範囲外(2^53以上)のIDが自動採番されうる。その場合、次回 getAll() の createRuleId() が
   * InvalidRuleIdError を投げ、保存済み一覧が読めなくなる。
   * よって未採番ルールにはアプリ側で決定的にIDを採番し、createRuleId() で安全整数検証する。
   * 安全整数範囲を超える場合は createRuleId() が InvalidRuleIdError を投げ、
   * replaceAll のトランザクションがロールバックされる（不正状態で永続化しない）。
   * @param rules 変換元のRewriteRule配列
   * @returns 変換されたRewriteRuleSchema配列（id採番済→未採番の順）
   */
  private convertToSchemasForRestore(rules: RewriteRule[]): RewriteRuleSchema[] {
    const assignedRules = rules.filter(rule => !isUnassignedRuleId(rule.id));
    const unassignedRules = rules.filter(rule => isUnassignedRuleId(rule.id));
    const assignedSchemas = assignedRules.map(rule => this.convertToSchemaForUpdate(rule));
    const maxAssignedId = assignedRules.reduce((max, rule) => Math.max(max, rule.id), 0);
    const unassignedSchemas = unassignedRules.map((rule, index) => ({
      ...this.convertToSchemaForCreate(rule),
      id: createRuleId(maxAssignedId + index + 1)
    }));
    return [...assignedSchemas, ...unassignedSchemas];
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
      isRegex: rule.isRegex,
      isActive: rule.isActive
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
      isRegex: rule.isRegex,
      isActive: rule.isActive
    };
  }

  /**
   * RewriteRuleSchemaをRewriteRuleに変換する
   * @param schema 変換元のRewriteRuleSchema
   * @returns 変換されたRewriteRule（idはcreateRuleId()で検証しRuleIdとして生成）
   */
  private convertSchemaToRule(schema: RewriteRuleSchema): RewriteRule {
    return new RewriteRule(
      createRuleId(schema.id!),
      schema.oldString,
      schema.newString,
      schema.urlPattern,
      schema.isRegex,
      schema.isActive
    );
  }

}
