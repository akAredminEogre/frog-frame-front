/**
 * JSON解析のポートインターフェース
 * CA準拠: Use-case層がJSON.parseに直接依存しないよう抽象化する
 */
export interface IJsonParser {
  /**
   * JSON文字列を解析する
   * @param jsonString 解析対象のJSON文字列
   * @returns 解析済みオブジェクト
   * @throws JsonSyntaxError 不正なJSONの場合
   */
  parse<T = unknown>(jsonString: string): T;

  /**
   * JSON文字列を解析し、結果がnull非許容のオブジェクトであることを検証する
   * @param jsonString 解析対象のJSON文字列
   * @returns 解析済みオブジェクト (Record<string, unknown>)
   * @throws JsonSyntaxError 不正なJSONの場合
   * @throws JsonStructureError 解析結果がオブジェクト型でない場合、またはnullの場合
   */
  parseAsObject(jsonString: string): Record<string, unknown>;
}
