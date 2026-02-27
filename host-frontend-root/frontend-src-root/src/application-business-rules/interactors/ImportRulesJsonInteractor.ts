import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { ImportRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonPreviewOutputData';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IImportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IImportRulesJsonUseCase';
import { IImportRulesJsonPresenter } from 'src/application-business-rules/ports/output/IImportRulesJsonPresenter';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_RULE_COUNT = 1000;

interface ImportedRuleData {
  id?: unknown;
  oldString?: unknown;
  newString?: unknown;
  urlPattern?: unknown;
  isRegex?: unknown;
  isActive?: unknown;
}

/**
 * ルールJSONインポートのInteractor
 * 2フェーズ制御フロー:
 *   Phase 1: importRulesJson() → JSON.parse() → バリデーション → getAll() → presentPreview()
 *   Phase 2: confirmImport() → delete() × N → create() × M → present()
 */
export class ImportRulesJsonInteractor implements IImportRulesJsonUseCase {
  private pendingRules: RewriteRule[] | null = null;

  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly presenter: IImportRulesJsonPresenter
  ) {}

  async importRulesJson(jsonString: string): Promise<void> {
    try {
      // ファイルサイズチェック（バイト数換算）
      if (new Blob([jsonString]).size > MAX_FILE_SIZE_BYTES) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(
            new Error('file size exceeded'),
            'validation',
            'ファイルサイズが上限（5MB）を超えています'
          )
        );
        return;
      }

      // L1: JSON構文チェック
      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonString);
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

      // L2: スキーマチェック（version / rules が必要）
      if (!this.isValidSchema(parsed)) {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(
            new Error('invalid schema'),
            'validation',
            'JSONスキーマが不正です（versionとrulesが必要です）'
          )
        );
        return;
      }

      const data = parsed as { version: string; rules: ImportedRuleData[] };

      // L3: バージョンチェック
      if (data.version !== '1.0') {
        this.presenter.presentError(
          new ImportRulesJsonErrorOutputData(
            new Error('unsupported version'),
            'validation',
            `未対応のバージョンです: ${data.version}`
          )
        );
        return;
      }

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

      // L4: 各ルールの必須フィールドチェック
      const rules: RewriteRule[] = [];
      for (let i = 0; i < data.rules.length; i++) {
        const ruleData = data.rules[i];
        if (!ruleData.oldString) {
          this.presenter.presentError(
            new ImportRulesJsonErrorOutputData(
              new Error('missing field'),
              'validation',
              `ルール #${i + 1}: oldStringが欠落しています`
            )
          );
          return;
        }
        rules.push(
          new RewriteRule(
            typeof ruleData.id === 'number' ? ruleData.id : 0,
            String(ruleData.oldString),
            String(ruleData.newString ?? ''),
            String(ruleData.urlPattern ?? ''),
            typeof ruleData.isRegex === 'boolean' ? ruleData.isRegex : false,
            typeof ruleData.isActive === 'boolean' ? ruleData.isActive : true
          )
        );
      }

      // 現在のルール件数を取得してプレビューデータを生成
      const currentRules = await this.repository.getAll();
      const currentCount = currentRules.toArray().length;

      this.pendingRules = rules;

      this.presenter.presentPreview(
        new ImportRulesJsonPreviewOutputData(currentCount, rules.length)
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
      // 全既存ルールを取得して削除
      const currentRules = await this.repository.getAll();
      const currentArray = currentRules.toArray();
      const previousCount = currentArray.length;

      for (const rule of currentArray) {
        await this.repository.delete(rule.id);
      }

      // 新規ルールを作成
      for (const rule of rulesToImport) {
        await this.repository.create(rule);
      }

      this.presenter.present(
        new ImportRulesJsonOutputData(rulesToImport.length, previousCount)
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

  private isValidSchema(data: unknown): data is { version: string; rules: ImportedRuleData[] } {
    return (
      typeof data === 'object' &&
      data !== null &&
      'version' in data &&
      typeof (data as Record<string, unknown>).version === 'string' &&
      'rules' in data &&
      Array.isArray((data as Record<string, unknown>).rules)
    );
  }
}
