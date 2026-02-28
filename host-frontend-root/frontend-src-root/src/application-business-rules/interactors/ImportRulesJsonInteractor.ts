import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { ImportRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonPreviewOutputData';
import { RulesJsonRuleEntryRaw } from 'src/application-business-rules/dto/RulesJsonSchema';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IImportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IImportRulesJsonUseCase';
import { IImportRulesJsonPresenter } from 'src/application-business-rules/ports/output/IImportRulesJsonPresenter';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ImportFileSize } from 'src/enterprise-business-rules/value-objects/ImportFileSize';
import { RulesJsonVersionSchema } from 'src/enterprise-business-rules/value-objects/RulesJsonVersionSchema';

const MAX_RULE_COUNT = 1000;

/**
 * ルールJSONインポートのInteractor
 * 2フェーズ制御フロー:
 *   Phase 1: importRulesJson() → jsonParser.parse() → バリデーション → getAll() → presentPreview()
 *   Phase 2: confirmImport() → delete() × N → create() × M → present()
 */
export class ImportRulesJsonInteractor implements IImportRulesJsonUseCase {
  private pendingRules: RewriteRules | null = null;

  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly presenter: IImportRulesJsonPresenter,
    private readonly jsonParser: IJsonParser
  ) {}

  async importRulesJson(inputData: ImportRulesJsonInputData): Promise<void> {
    const { jsonString, byteSize } = inputData;
    try {
      // ファイルサイズチェック（バイト数換算）
      // byteSize は frameworks-and-drivers 層（Blob API）で計算済み
      // サイズ上限判定はenterprise-business-rules層のImportFileSizeに委譲
      const importFileSize = new ImportFileSize(byteSize);
      if (importFileSize.isExceedingLimit()) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(
            new Error('file size exceeded'),
            'validation',
            'ファイルサイズが上限（5MB）を超えています'
          )
        );
        return;
      }

      // L1: JSON構文チェック + Objectチェック
      // CA準拠: JSON.parseはframeworks-and-drivers層（IJsonParser）を介して呼び出す
      // parseAsObject は構文エラー・null・非オブジェクト型をまとめて検出する
      let parsed: Record<string, unknown>;
      try {
        parsed = this.jsonParser.parseAsObject(jsonString);
      } catch {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(
            new Error('invalid JSON'),
            'parse',
            '不正なJSONファイルです'
          )
        );
        return;
      }

      // L2/L3: スキーマ・バージョンチェック（enterprise-business-rules層に委譲）
      // parsed は parseAsObject によりオブジェクト・非null が保証済み
      const versionSchema = new RulesJsonVersionSchema(parsed);
      if (!versionSchema.isValidSchema()) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(
            new Error('invalid schema'),
            'validation',
            'JSONスキーマが不正です（versionとrulesが必要です）'
          )
        );
        return;
      }

      // version はJSONスキーマの互換性を管理するバージョン識別子。
      // エクスポート機能も '1.0' を出力する（RulesJsonFileSchema参照）。
      // フィールド追加・削除などスキーマ変更時はバージョンを上げ、ここに分岐を追加する。
      if (!versionSchema.isSupportedVersion()) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(
            new Error('unsupported version'),
            'validation',
            `未対応のバージョンです: ${versionSchema.getVersion()}`
          )
        );
        return;
      }

      const data = parsed as { version: string; rules: RulesJsonRuleEntryRaw[] };

      // L5: ルール件数0件チェック
      if (data.rules.length === 0) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(
            new Error('no rules'),
            'validation',
            'インポートするルールがありません'
          )
        );
        return;
      }

      // ルール件数上限チェック
      if (data.rules.length > MAX_RULE_COUNT) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(
            new Error('rule count exceeded'),
            'validation',
            `ルール件数が上限（${MAX_RULE_COUNT}件）を超えています`
          )
        );
        return;
      }

      // L4: 各ルールの必須フィールドチェック（RewriteRules FCCで管理）
      const rulesRecord: Record<string, RewriteRule> = {};
      for (let i = 0; i < data.rules.length; i++) {
        const ruleData = data.rules[i];
        if (ruleData.oldString === null || ruleData.oldString === undefined || ruleData.oldString === '') {
          this.presenter.presentError(
            new ImportRulesJsonErrorOutputData(
              new Error('missing field'),
              'validation',
              `ルール #${i + 1}: oldStringが欠落または空白です`
            )
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
      this.presenter.presentError(
        new ImportRulesJsonErrorOutputData(
          error,
          'storage',
          `インポート処理中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`
        )
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
        new ImportRulesJsonErrorOutputData(
          error,
          'storage',
          `インポート処理中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

}
