import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';

/**
 * JSON.parseのframeworks-and-drivers層ラッパー
 * CA準拠: JSON.parseの直接使用をこの層に閉じ込め、Use-case層の依存を排除する
 */
export class JsonParser implements IJsonParser {
  parse<T = unknown>(jsonString: string): T {
    return JSON.parse(jsonString) as T;
  }
}
