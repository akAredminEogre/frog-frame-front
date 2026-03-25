import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import {
  InvalidJsonImportError,
  InvalidSchemaImportError,
  StorageImportError,
} from 'src/application-business-rules/errors/ImportRulesJsonErrors';
import { JsonStructureError, JsonSyntaxError } from 'src/application-business-rules/errors/JsonParserErrors';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IImportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IImportRulesJsonUseCase';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { ImportFileSizeError } from 'src/enterprise-business-rules/errors/ImportFileSizeError';
import { ImportFileSize } from 'src/enterprise-business-rules/value-objects/ImportFileSize';
import {
  EmptyRulesCollectionError,
  ImportRulesCollection,
  RulesCollectionCountExceededError,
  RulesCollectionMissingFieldError,
} from 'src/enterprise-business-rules/value-objects/ImportRulesCollection';
import {
  InvalidRulesJsonSchemaError,
  RulesJsonVersionSchema,
  UnsupportedRulesJsonVersionError,
} from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

export interface IImportRulesJsonPresenter {
  present(output: ImportRulesJsonOutputData): void;
  presentError(error: ImportRulesJsonErrorOutputData): void;
}

/**
 * ルールJSONインポートのInteractor（1フェーズ）
 * ファイル読み取り → バリデーション → 全件置換 → 完了通知を一連で実行する
 */
export class ImportRulesJsonInteractor implements IImportRulesJsonUseCase {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly presenter: IImportRulesJsonPresenter,
    private readonly jsonParser: IJsonParser,
    private readonly fileTextReader: IFileTextReader
  ) {}

  async importRulesJson(inputData: ImportRulesJsonInputData): Promise<void> {
    try {
      // ファイルサイズチェック
      new ImportFileSize(inputData.file.size);

      // テキスト読み取り
      const jsonString = await this.fileTextReader.readAsText(inputData.file);

      // JSON解析・スキーマ/バージョンチェック
      const parsed = this.jsonParser.parseAsObject(jsonString);
      new RulesJsonVersionSchema(parsed);

      // ルール件数・フィールドチェック → RewriteRule[] 構築
      const collection = new ImportRulesCollection(parsed.rules as unknown[]);
      const validatedRules = collection.toArray();

      // 現在のルール件数を取得して全件置換
      let previousCount = 0;
      try {
        const currentRules = await this.repository.getAll();
        previousCount = currentRules.toArray().length;
        await this.repository.replaceAll(validatedRules);
      } catch (error) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new StorageImportError(error), 'storage')
        );
        return;
      }

      this.presenter.present(
        new ImportRulesJsonOutputData(validatedRules.length, previousCount)
      );
    } catch (error) {
      if (error instanceof JsonSyntaxError) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new InvalidJsonImportError(), 'parse')
        );
        return;
      }
      if (error instanceof JsonStructureError) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new InvalidSchemaImportError(), 'validation')
        );
        return;
      }
      if (error instanceof ImportFileSizeError) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(error, 'validation')
        );
        return;
      }
      if (error instanceof InvalidRulesJsonSchemaError) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new InvalidSchemaImportError(), 'validation')
        );
        return;
      }
      if (error instanceof UnsupportedRulesJsonVersionError) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(error, 'validation')
        );
        return;
      }
      if (
        error instanceof EmptyRulesCollectionError ||
        error instanceof RulesCollectionCountExceededError ||
        error instanceof RulesCollectionMissingFieldError
      ) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(error, 'validation')
        );
        return;
      }
      this.presenter.presentError(
        new ImportRulesJsonErrorOutputData(new StorageImportError(error), 'storage')
      );
    }
  }
}
