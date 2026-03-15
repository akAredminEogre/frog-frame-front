import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { RulesJsonRuleEntryRaw } from 'src/application-business-rules/dto/RulesJsonSchema';
import {
  EmptyRulesImportError,
  InvalidJsonImportError,
  InvalidSchemaImportError,
  MAX_RULE_COUNT,
  MissingFieldImportError,
  RuleCountExceededImportError,
  StorageImportError,
  UnsupportedVersionImportError,
} from 'src/application-business-rules/errors/ImportRulesJsonErrors';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ImportFileSizeError } from 'src/enterprise-business-rules/errors/ImportFileSizeError';
import { ImportFileSize } from 'src/enterprise-business-rules/value-objects/ImportFileSize';
import { InvalidRulesJsonSchemaError, RulesJsonVersionSchema } from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

export interface IImportRulesJsonPresenter {
  present(output: ImportRulesJsonOutputData): void;
  presentError(error: ImportRulesJsonErrorOutputData): void;
}

/**
 * ルールJSONインポートのInteractor（1フェーズ）
 * ファイル読み取り → バリデーション → 全件置換 → 完了通知を一連で実行する
 */
export class ImportRulesJsonInteractor {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly presenter: IImportRulesJsonPresenter,
    private readonly jsonParser: IJsonParser,
    private readonly fileTextReader: IFileTextReader
  ) {}

  async importRulesJson(file: File): Promise<void> {
    try {
      // ファイルサイズチェック
      new ImportFileSize(file.size);

      // テキスト読み取り
      const jsonString = await this.fileTextReader.readAsText(file);

      // JSON解析
      let parsed: Record<string, unknown>;
      try {
        parsed = this.jsonParser.parseAsObject(jsonString);
      } catch (e) {
        if (e instanceof SyntaxError) {
          this.presenter.presentError(
            new ImportRulesJsonErrorOutputData(new InvalidJsonImportError(), 'parse')
          );
        } else {
          this.presenter.presentError(
            new ImportRulesJsonErrorOutputData(new InvalidSchemaImportError(), 'validation')
          );
        }
        return;
      }

      // バージョンチェック
      const versionSchema = new RulesJsonVersionSchema(parsed);
      if (!versionSchema.isSupportedVersion()) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new UnsupportedVersionImportError(parsed.version), 'validation')
        );
        return;
      }

      const data = parsed as { version: string; rules: RulesJsonRuleEntryRaw[] };

      // 0件チェック
      if (data.rules.length === 0) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new EmptyRulesImportError(), 'validation')
        );
        return;
      }

      // 件数上限チェック
      if (data.rules.length > MAX_RULE_COUNT) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new RuleCountExceededImportError(), 'validation')
        );
        return;
      }

      // 各ルールの必須フィールドチェック → RewriteRule[] 構築
      const validatedRules: RewriteRule[] = [];
      for (let i = 0; i < data.rules.length; i++) {
        const ruleData = data.rules[i];
        if (ruleData.oldString === null || ruleData.oldString === undefined || ruleData.oldString === '') {
          this.presenter.presentError(
            new ImportRulesJsonErrorOutputData(new MissingFieldImportError(i + 1), 'validation')
          );
          return;
        }
        validatedRules.push(new RewriteRule(
          typeof ruleData.id === 'number' ? ruleData.id : 0,
          String(ruleData.oldString),
          String(ruleData.newString ?? ''),
          String(ruleData.urlPattern ?? ''),
          typeof ruleData.isRegex === 'boolean' ? ruleData.isRegex : false,
          typeof ruleData.isActive === 'boolean' ? ruleData.isActive : true
        ));
      }

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
      this.presenter.presentError(
        new ImportRulesJsonErrorOutputData(new StorageImportError(error), 'storage')
      );
    }
  }
}
