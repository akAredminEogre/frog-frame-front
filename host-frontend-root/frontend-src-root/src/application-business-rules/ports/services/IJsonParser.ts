/**
 * JSON解析のポートインターフェース
 * CA準拠: Use-case層がJSON.parseに直接依存しないよう抽象化する
 */
export interface IJsonParser {
  /**
   * JSON文字列を解析する
   * @param jsonString 解析対象のJSON文字列
   * @returns 解析済みオブジェクト
   * @throws SyntaxError 不正なJSONの場合
   */
  parse<T = unknown>(jsonString: string): T;
}
