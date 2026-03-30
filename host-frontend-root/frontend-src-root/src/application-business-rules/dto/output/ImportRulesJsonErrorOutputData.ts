import {
  InvalidJsonImportError,
  InvalidSchemaImportError,
  StorageImportError,
} from 'src/application-business-rules/errors/ImportRulesJsonErrors';
import { JsonStructureError, JsonSyntaxError } from 'src/application-business-rules/errors/JsonParserErrors';
import { ImportFileSizeError } from 'src/enterprise-business-rules/errors/ImportFileSizeError';
import {
  EmptyRulesCollectionError,
  RulesCollectionCountExceededError,
  RulesCollectionMissingFieldError,
} from 'src/enterprise-business-rules/value-objects/ImportRulesCollection';
import {
  InvalidRulesJsonSchemaError,
  UnsupportedRulesJsonVersionError,
} from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

type ErrorHandler = (error: unknown) => ImportRulesJsonErrorOutputData;

/**
 * ルールJSONインポートエラーの出力データ
 * エラー種別とユーザー向けメッセージを保持する。
 * メッセージはエラーオブジェクトから自動抽出するため、
 * Interactorが直接メッセージ文字列を知る必要はない。
 */
export class ImportRulesJsonErrorOutputData {
  private static readonly strategies: Map<Function, ErrorHandler> = (() => {
    const validationPassthrough: ErrorHandler = (error) =>
      new ImportRulesJsonErrorOutputData(error, 'validation');

    return new Map<Function, ErrorHandler>([
      [JsonSyntaxError, () => new ImportRulesJsonErrorOutputData(new InvalidJsonImportError(), 'parse')],
      [JsonStructureError, () => new ImportRulesJsonErrorOutputData(new InvalidSchemaImportError(), 'validation')],
      [ImportFileSizeError, validationPassthrough],
      [InvalidRulesJsonSchemaError, () => new ImportRulesJsonErrorOutputData(new InvalidSchemaImportError(), 'validation')],
      [UnsupportedRulesJsonVersionError, validationPassthrough],
      [EmptyRulesCollectionError, validationPassthrough],
      [RulesCollectionCountExceededError, validationPassthrough],
      [RulesCollectionMissingFieldError, validationPassthrough],
    ]);
  })();

  private readonly _message: string;

  constructor(
    public readonly error: unknown,
    public readonly errorType: 'parse' | 'validation' | 'storage'
  ) {
    this._message = error instanceof Error ? error.message : 'インポート処理中に予期しないエラーが発生しました';
  }

  static fromError(error: unknown): ImportRulesJsonErrorOutputData {
    for (const [ErrorClass, handler] of ImportRulesJsonErrorOutputData.strategies) {
      if (error instanceof ErrorClass) {
        return handler(error);
      }
    }
    return new ImportRulesJsonErrorOutputData(new StorageImportError(error), 'storage');
  }

  get message(): string {
    return this._message;
  }
}
