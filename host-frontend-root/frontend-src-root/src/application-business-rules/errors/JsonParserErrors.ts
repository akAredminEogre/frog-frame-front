/**
 * JSON解析ポート層のカスタムエラークラス
 * CA準拠: アプリケーション層がnative Error型に依存しないよう抽象化
 */

export class JsonSyntaxError extends Error {
  name = 'JsonSyntaxError';

  constructor(message: string = 'Invalid JSON syntax') {
    super(message);
    Object.setPrototypeOf(this, JsonSyntaxError.prototype);
  }
}

export class JsonStructureError extends Error {
  name = 'JsonStructureError';

  constructor(message: string = 'JSON structure validation failed') {
    super(message);
    Object.setPrototypeOf(this, JsonStructureError.prototype);
  }
}
