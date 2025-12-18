import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveOutputData';
import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/IToggleRuleActivePresenter';

/**
 * ルールの有効/無効切り替え結果のPresenter（スケルトン実装）
 */
export class ToggleRuleActivePresenter implements IToggleRuleActivePresenter {
  /**
   * 成功時の出力を表示する
   * @param outputData 出力データ
   */
  presentSuccess(outputData: ToggleRuleActiveOutputData): void {
    throw new Error(`Not implemented: presentSuccess with toggledRule.id=${outputData.toggledRule.id}`);
  }

  /**
   * 失敗時の出力を表示する
   * @param error エラー情報
   */
  presentError(error: Error): void {
    throw new Error(`Not implemented: presentError with message=${error.message}`);
  }
}
