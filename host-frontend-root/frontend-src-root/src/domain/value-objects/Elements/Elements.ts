import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplyRulesOnPageLoadUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase';

/**
 * DOM要素を管理するファーストクラスコレクション
 */
export class Elements {
  private nodes: Set<Element>;

  constructor() {
    this.nodes = new Set();
  }

  /**
   * 要素を追加する
   */
  addElement(element: Element): void {
    this.nodes.add(element);
  }

  /**
   * 要素を配列として取得する
   */
  toArray(): Element[] {
    return Array.from(this.nodes);
  }

  /**
   * 他のElementsコレクションの要素をマージする
   */
  merge(other: Elements): void {
    other.nodes.forEach((element) => this.nodes.add(element));
  }

  /**
   * 保持している要素のうち、documentに存在するものを新しいElementsとして取り出し、コレクションをクリアする
   */
  extractAttachedElements(): Elements {
    const attachedElements = new Elements();
    Array.from(this.nodes)
      .filter((element) => document.body.contains(element))
      .forEach((element) => attachedElements.addElement(element));
    this.nodes.clear();
    return attachedElements;
  }

  /**
   * 各要素に対して非同期でルール適用処理を実行する
   */
  async applyRules(
    repository: IRewriteRuleRepository,
    currentUrlService: ICurrentUrlService
  ): Promise<void> {
    const applyRulesUseCase = new ApplyRulesOnPageLoadUseCase(repository, currentUrlService);
    for (const element of this.nodes) {
      await applyRulesUseCase.exec(element);
    }
  }
}
