import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { TabUrl } from 'src/domain/value-objects/TabUrl';
import { WindowLocationService } from 'src/infrastructure/windows/WindowLocationService';

/**
 * DOM Mutationで追加されたノードにルールを適用するユースケース
 * MutationObserverから検知されたノードに対してrewrite rulesを適用する
 */
export class ApplyRulesToMutatedNodesUseCase {
  private repository: IRewriteRuleRepository;
  private windowLocationService: WindowLocationService;

  constructor(repository: IRewriteRuleRepository, windowLocationService: WindowLocationService) {
    this.repository = repository;
    this.windowLocationService = windowLocationService;
  }

  /**
   * 追加されたノードにルールを適用する
   * @param nodes 適用対象のノード配列
   * @param isNodeInDocument ノードがdocument内に存在するかを判定する関数
   */
  async applyRules(
    nodes: Element[],
    isNodeInDocument: (node: Element) => boolean
  ): Promise<void> {
    const tabUrl = new TabUrl(this.windowLocationService.getCurrentUrl());
    const applySavedRulesUseCase = new ApplySavedRulesOnPageLoadUseCase(this.repository);

    for (const node of nodes) {
      if (isNodeInDocument(node)) {
        await applySavedRulesUseCase.applyAllRules(node, tabUrl.value);
      }
    }
  }
}
