export const SUPPORTED_RULES_JSON_VERSION = '1.0';

/**
 * ルールJSONスキーマ不正エラー
 * コンストラクタがスキーマ検証に失敗した場合にスローする
 */
export class InvalidRulesJsonSchemaError extends Error {
  constructor() {
    super(
      'JSONスキーマが不正です: "version"（文字列）または "rules"（配列）フィールドが存在しないか型が正しくありません'
    );
    this.name = 'InvalidRulesJsonSchemaError';
  }
}

/**
 * ルールJSONのバージョン/スキーマ検証Value Object
 * スキーマ整合性チェック・バージョン互換性チェックはドメインルールのため
 * enterprise-business-rules層に配置する
 * コンストラクタでスキーマ検証を行い、不正な場合は InvalidRulesJsonSchemaError をスロー
 */
export class RulesJsonVersionSchema {
  constructor(private readonly data: Record<string, unknown>) {
    if (!this.isValidSchema()) {
      throw new InvalidRulesJsonSchemaError();
    }
  }

  /**
   * スキーマ構造チェック（versionフィールドが文字列、rulesフィールドが配列かどうか）
   */
  isValidSchema(): boolean {
    return (
      'version' in this.data &&
      typeof this.data.version === 'string' &&
      'rules' in this.data &&
      Array.isArray(this.data.rules)
    );
  }

  /**
   * バージョン互換性チェック（サポート対象バージョンかどうか）
   * コンストラクタでスキーマ検証済みのため、常に安全に呼び出し可能
   */
  isSupportedVersion(): boolean {
    return this.data.version === SUPPORTED_RULES_JSON_VERSION;
  }

}
