import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
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
 * インポートエラー出力データのStrategyファクトリー
 * エラーの型に応じて適切なImportRulesJsonErrorOutputDataを生成する
 * ParserContextStrategyFactoryと同一パターンを採用
 */
export class ImportRulesJsonErrorOutputDataFactory {
  private readonly strategies: Map<Function, ErrorHandler>;

  constructor() {
    const validationPassthrough: ErrorHandler = (error) =>
      new ImportRulesJsonErrorOutputData(error, 'validation');

    this.strategies = new Map<Function, ErrorHandler>([
      [JsonSyntaxError, (_error) => new ImportRulesJsonErrorOutputData(new InvalidJsonImportError(), 'parse')],
      [JsonStructureError, (_error) => new ImportRulesJsonErrorOutputData(new InvalidSchemaImportError(), 'validation')],
      [ImportFileSizeError, validationPassthrough],
      [InvalidRulesJsonSchemaError, (_error) => new ImportRulesJsonErrorOutputData(new InvalidSchemaImportError(), 'validation')],
      [UnsupportedRulesJsonVersionError, validationPassthrough],
      [EmptyRulesCollectionError, validationPassthrough],
      [RulesCollectionCountExceededError, validationPassthrough],
      [RulesCollectionMissingFieldError, validationPassthrough],
    ]);
  }

  create(error: unknown): ImportRulesJsonErrorOutputData {
    for (const [ErrorClass, handler] of this.strategies) {
      if (error instanceof ErrorClass) {
        return handler(error);
      }
    }
    return new ImportRulesJsonErrorOutputData(new StorageImportError(error), 'storage');
  }
}
