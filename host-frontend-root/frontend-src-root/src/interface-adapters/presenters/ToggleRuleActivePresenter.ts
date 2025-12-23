import { ToggleRuleActiveErrorOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveErrorOutputData';
import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveOutputData';
import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/IToggleRuleActivePresenter';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * ルールの有効/無効切り替え結果のPresenter
 * OutputDataを受け取り、コールバック関数を呼び出してViewにトグル後のルール情報を通知する
 */
export class ToggleRuleActivePresenter implements IToggleRuleActivePresenter {
  constructor(
    private readonly updateRuleInView: (rule: RewriteRule) => void,
    private readonly showErrorInView: (ruleId: number, message: string) => void
  ) {}

  /**
   * 成功時の出力を表示する
   * @param outputData 出力データ
   */
  present(outputData: ToggleRuleActiveOutputData): void {
    this.updateRuleInView(outputData.toggledRule);
  }

  /**
   * エラー時の出力を表示する
   * @param errorData エラーデータ
   */
  presentError(errorData: ToggleRuleActiveErrorOutputData): void {
    this.showErrorInView(errorData.ruleId, errorData.message);
  }
}
