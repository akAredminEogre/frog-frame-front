import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { StorageImportError } from 'src/application-business-rules/errors/ImportRulesJsonErrors';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IConfirmImportUseCase } from 'src/application-business-rules/ports/input/IConfirmImportUseCase';
import { IConfirmImportPresenter } from 'src/application-business-rules/ports/output/IConfirmImportPresenter';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * インポート確定のInteractor
 * Phase 2: Phase1でsetPendingRules()に保持されたルールを消費し、全件置換して完了を通知する
 * 2フェーズ設計: Phase1(preview)がpendingRulesをセット → Phase2(confirm)がそれを消費
 */
export class ConfirmImportInteractor implements IConfirmImportUseCase {
  private pendingRules: RewriteRule[] | null = null;

  constructor(
    private readonly repository: IRewriteRuleRepository,
    private readonly presenter: IConfirmImportPresenter
  ) {}

  /**
   * Phase1のプレビュー完了後に呼び出し、確定対象ルールを保持する
   */
  setPendingRules(inputData: RewriteRule[]): void {
    this.pendingRules = inputData;
  }

  async confirmImport(): Promise<void> {
    if (!this.pendingRules) return;
    const rulesToImport = this.pendingRules;

    let previousCount = 0;
    try {
      const currentRules = await this.repository.getAll();
      previousCount = currentRules.toArray().length;

      await this.repository.replaceAll(rulesToImport);
    } catch (error) {
      this.presenter.presentError(
        new ImportRulesJsonErrorOutputData(new StorageImportError(error), 'storage')
      );
      return;
    }

    this.presenter.present(
      new ImportRulesJsonOutputData(rulesToImport.length, previousCount)
    );
  }
}
