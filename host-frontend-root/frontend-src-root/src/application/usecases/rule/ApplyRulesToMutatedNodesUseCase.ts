import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';

/**
 * DOM Mutationで追加されたノードにルールを適用するユースケース
 * MutationObserverから検知されたノードに対してrewrite rulesを適用する
 */
export class ApplyRulesToMutatedNodesUseCase {
  private repository: IRewriteRuleRepository;

  constructor(repository: IRewriteRuleRepository) {
    this.repository = repository;
  }

  /**
   * 追加されたノードにルールを適用する
   * @param nodes 適用対象のノード配列
   * @param currentUrl 現在のページURL
   * @param isNodeInDocument ノードがdocument内に存在するかを判定する関数
   */
  async applyRules(
    nodes: Element[],
    currentUrl: string,
    isNodeInDocument: (node: Element) => boolean
  ): Promise<void> {
    const applySavedRulesUseCase = new ApplySavedRulesOnPageLoadUseCase(this.repository);

    for (const node of nodes) {
      if (isNodeInDocument(node)) {
        await applySavedRulesUseCase.applyAllRules(node, currentUrl);
      }
    }
  }
}
