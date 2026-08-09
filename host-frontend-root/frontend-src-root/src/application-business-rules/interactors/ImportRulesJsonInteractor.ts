import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IImportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IImportRulesJsonUseCase';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { ImportFileSize } from 'src/enterprise-business-rules/value-objects/ImportFileSize';
import { ImportRulesCollection } from 'src/enterprise-business-rules/value-objects/ImportRulesCollection';
import { RulesJsonVersionSchema } from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

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
    private readonly jsonParser: IJsonParser
  ) {}

  async importRulesJson(inputData: ImportRulesJsonInputData): Promise<void> {
    try {
      // ファイルサイズチェック（F&D 境界で number に変換済み）
      new ImportFileSize(inputData.fileSizeBytes);

      // テキスト読み取り済み文字列を利用
      const jsonString = inputData.fileText;

      // JSON解析・スキーマ/バージョンチェック
      const parsed = this.jsonParser.parseAsObject(jsonString);
      new RulesJsonVersionSchema(parsed);

      // ルール件数・フィールドチェック → RewriteRule[] 構築
      const collection = new ImportRulesCollection(parsed.rules as unknown[]);
      const validatedRules = collection.toArray();

      // 全件置換
      await this.repository.replaceAll(validatedRules);

      this.presenter.present(new ImportRulesJsonOutputData(validatedRules.length));
    } catch (error) {
      this.presenter.presentError(ImportRulesJsonErrorOutputData.fromError(error));
    }
  }
}
