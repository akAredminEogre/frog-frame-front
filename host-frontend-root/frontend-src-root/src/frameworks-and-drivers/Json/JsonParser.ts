import { JsonStructureError, JsonSyntaxError } from 'src/application-business-rules/errors/JsonParserErrors';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';

/**
 * JSON.parseのframeworks-and-drivers層ラッパー
 * CA準拠: JSON.parseの直接使用をこの層に閉じ込め、Use-case層の依存を排除する
 */
export class JsonParser implements IJsonParser {
  parse<T = unknown>(jsonString: string): T {
    try {
      return JSON.parse(jsonString) as T;
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new JsonSyntaxError(e.message);
      }
      throw e;
    }
  }

  /**
   * JSON文字列を解析し、結果がnull非許容のオブジェクトであることを検証する
   * @throws JsonSyntaxError 不正なJSONの場合
   * @throws JsonStructureError 解析結果がオブジェクト型でない場合（null・配列・プリミティブ値）
   */
  parseAsObject(jsonString: string): Record<string, unknown> {
    const parsed: unknown = this.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new JsonStructureError(
        `Expected a JSON object, but got: ${parsed === null ? 'null' : Array.isArray(parsed) ? 'array' : typeof parsed}`
      );
    }
    return parsed as Record<string, unknown>;
  }
}
