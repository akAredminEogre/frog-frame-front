import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { ImportRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonPreviewOutputData';
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
import { IImportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IImportRulesJsonUseCase';
import { IImportRulesJsonPresenter } from 'src/application-business-rules/ports/output/IImportRulesJsonPresenter';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ImportFileSizeError } from 'src/enterprise-business-rules/errors/ImportFileSizeError';
import { ImportFileSize } from 'src/enterprise-business-rules/value-objects/ImportFileSize';
import { InvalidRulesJsonSchemaError, RulesJsonVersionSchema } from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

/**
 * ルールJSONインポートのInteractor
 * 2フェーズ制御フロー:
 *   Phase 1: importRulesJson() → ImportFileSize → fileTextReader → jsonParser.parse() → バリデーション → getAll() → presentPreview()
 *   Phase 2: confirmImport() → replaceAll() → present()
 */
export class ImportRulesJsonInteractor implements IImportRulesJsonUseCase {
  private pendingRules: RewriteRules | null = null;

  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly presenter: IImportRulesJsonPresenter,
    private readonly jsonParser: IJsonParser,
    private readonly fileTextReader: IFileTextReader
  ) {}

  async importRulesJson(inputData: ImportRulesJsonInputData): Promise<void> {
    // 新規インポート開始時に保留状態をリセット（pendingRules残留バグ防止）
    this.pendingRules = null;
    const file = inputData.file;
    try {
      // ①ファイルサイズチェック（File.sizeによる高速チェック）
      // EBR準拠: ImportFileSize VO（enterprise-business-rules）を直接使用
      // コンストラクタがサイズ超過時にImportFileSizeErrorをスロー
      new ImportFileSize(file.size);

      // ②jsonString取得（サイズチェック通過後のみ読み取り）
      // CA準拠: IFileTextReaderポート経由でFileReader APIへのアクセスを抽象化
      const jsonString = await this.fileTextReader.readAsText(file);

      // L1: JSON構文チェック + Objectチェック
      // CA準拠: JSON.parseはframeworks-and-drivers層（IJsonParser）を介して呼び出す
      // parseAsObject は構文エラー・null・非オブジェクト型をまとめて検出する
      let parsed: Record<string, unknown>;
      try {
        parsed = this.jsonParser.parseAsObject(jsonString);
      } catch {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(new InvalidJsonImportError(), 'parse')
        );
        return;
      }

      // L2/L3: スキーマ・バージョンチェック（enterprise-business-rules層に委譲）
      // parsed は parseAsObject によりオブジェクト・非null が保証済み
      // RulesJsonVersionSchema コンストラクタがスキーマ不正時に InvalidRulesJsonSchemaError をスロー
      const versionSchema = new RulesJsonVersionSchema(parsed);

      // version はJSONスキーマの互換性を管理するバージョン識別子。
      // エクスポート機能も '1.0' を出力する（RulesJsonFileSchema参照）。
      // フィールド追加・削除などスキーマ変更時はバージョンを上げ、ここに分岐を追加する。
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

      // L4: 各ルールの必須フィールドチェック（RewriteRules FCCで管理）
      const rulesRecord: Record<string, RewriteRule> = {};
      for (let i = 0; i < data.rules.length; i++) {
        const ruleData = data.rules[i];
        if (ruleData.oldString === null || ruleData.oldString === undefined || ruleData.oldString === '') {
          this.presenter.presentError(
            new ImportRulesJsonErrorOutputData(new MissingFieldImportError(i + 1), 'validation')
          );
          return;
        }
        rulesRecord[String(i)] = new RewriteRule(
          typeof ruleData.id === 'number' ? ruleData.id : 0,
          String(ruleData.oldString),
          String(ruleData.newString ?? ''),
          String(ruleData.urlPattern ?? ''),
          typeof ruleData.isRegex === 'boolean' ? ruleData.isRegex : false,
          typeof ruleData.isActive === 'boolean' ? ruleData.isActive : true
        );
      }
      const rules = new RewriteRules(rulesRecord);

      // 現在のルール件数を取得してプレビューデータを生成
      const currentRules = await this.repository.getAll();
      const currentCount = currentRules.toArray().length;

      this.pendingRules = rules;

      this.presenter.presentPreview(
        new ImportRulesJsonPreviewOutputData(currentCount, rules.toArray().length)
      );
    } catch (error) {
      this.pendingRules = null;
      // ImportFileSizeError はEBR層で詳細メッセージを保有するため、
      // Interactor はerrorオブジェクトをそのまま渡す（メッセージ詳細を知らない設計）
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

  async confirmImport(): Promise<void> {
    if (!this.pendingRules) {
      return;
    }

    const rulesToImport = this.pendingRules;
    this.pendingRules = null;

    try {
      // 現在の件数を取得（完了メッセージ用）
      const currentRules = await this.repository.getAll();
      const previousCount = currentRules.toArray().length;

      // トランザクション内でアトミックに全置換（削除→作成）
      await this.repository.replaceAll(rulesToImport.toArray());

      this.presenter.present(
        new ImportRulesJsonOutputData(rulesToImport.toArray().length, previousCount)
      );
    } catch (error) {
      this.presenter.presentError(
        new ImportRulesJsonErrorOutputData(new StorageImportError(error), 'storage')
      );
    }
  }

}
