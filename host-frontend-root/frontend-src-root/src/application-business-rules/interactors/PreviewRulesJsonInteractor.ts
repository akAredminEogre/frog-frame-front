import { PreviewRulesJsonInputData } from 'src/application-business-rules/dto/input/PreviewRulesJsonInputData';
import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { PreviewRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/PreviewRulesJsonPreviewOutputData';
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
import { IPreviewRulesJsonUseCase } from 'src/application-business-rules/ports/input/IPreviewRulesJsonUseCase';
import { IPreviewRulesJsonPresenter } from 'src/application-business-rules/ports/output/IPreviewRulesJsonPresenter';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ImportFileSizeError } from 'src/enterprise-business-rules/errors/ImportFileSizeError';
import { ImportFileSize } from 'src/enterprise-business-rules/value-objects/ImportFileSize';
import { InvalidRulesJsonSchemaError, RulesJsonVersionSchema } from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

/**
 * ルールJSONプレビューのInteractor（ステートレス）
 * Phase 1のみを担当: ファイル読み取り → バリデーション → presentPreview()
 * pendingRules は ConfirmImportInteractor が保持する設計
 * （プレビュー確定後に Factory 経由で ConfirmImportInteractor.setPendingRules() をコール）
 */
export class PreviewRulesJsonInteractor implements IPreviewRulesJsonUseCase {
  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly presenter: IPreviewRulesJsonPresenter,
    private readonly jsonParser: IJsonParser,
    private readonly fileTextReader: IFileTextReader
  ) {}

  async previewRulesJson(inputData: PreviewRulesJsonInputData): Promise<void> {
    const file = inputData.file;
    try {
      // ①ファイルサイズチェック（EBR準拠: ImportFileSize VO）
      new ImportFileSize(file.size);

      // ②jsonString取得
      const jsonString = await this.fileTextReader.readAsText(file);

      // L1: JSON構文チェック + Objectチェック
      // SyntaxError: 不正なJSON → parseエラー（「不正なJSONファイルです」）
      // TypeError: トップレベルが配列/null/プリミティブ → validationエラー（スキーマ不正）
      let parsed: Record<string, unknown>;
      try {
        parsed = this.jsonParser.parseAsObject(jsonString);
      } catch (e) {
        if (e instanceof SyntaxError) {
          this.presenter.presentError(
            new ImportRulesJsonErrorOutputData(new InvalidJsonImportError(), 'parse')
          );
        } else {
          // TypeError: 解析結果がオブジェクト型でない（null・配列・プリミティブ値）
          this.presenter.presentError(
            new ImportRulesJsonErrorOutputData(new InvalidSchemaImportError(), 'validation')
          );
        }
        return;
      }

      // L2/L3: スキーマ・バージョンチェック
      const versionSchema = new RulesJsonVersionSchema(parsed);
      if (!versionSchema.isSupportedVersion()) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new UnsupportedVersionImportError(parsed.version), 'validation')
        );
        return;
      }

      const data = parsed as { version: string; rules: RulesJsonRuleEntryRaw[] };

      // L5: ルール件数0件チェック
      if (data.rules.length === 0) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new EmptyRulesImportError(), 'validation')
        );
        return;
      }

      // ルール件数上限チェック
      if (data.rules.length > MAX_RULE_COUNT) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new RuleCountExceededImportError(), 'validation')
        );
        return;
      }

      // L4: 各ルールの必須フィールドチェック → RewriteRule[] 構築
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

      // 現在のルール件数を取得してプレビューデータを生成
      const currentRules = await this.repository.getAll();
      const currentCount = currentRules.toArray().length;

      this.presenter.presentPreview(
        new PreviewRulesJsonPreviewOutputData(currentCount, validatedRules.length, validatedRules)
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
