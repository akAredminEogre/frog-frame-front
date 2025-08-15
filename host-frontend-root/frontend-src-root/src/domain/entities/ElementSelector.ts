import { SelectionService } from '../../infrastructure/selection/SelectionService';

/**
 * DOM操作で使用する定数
 */
const NODE_TYPES = {
  TEXT_NODE: 3,
  ELEMENT_NODE: 1
} as const;

/**
 * ユーザーのテキスト選択範囲から、置換対象となる最適なHTML要素を特定するドメインエンティティ。
 * 複雑なDOM構造や複数ノードにまたがる選択に対応し、最小かつ意味のある要素を返却します。
 */
export class ElementSelector {
  private selectionService: SelectionService;

  constructor(selectionService?: SelectionService) {
    this.selectionService = selectionService || new SelectionService();
  }
  /**
   * 現在の選択範囲から最適なHTML要素を取得します。
   * @returns 発見された要素のouterHTML。適切な要素が見つからない場合は選択範囲のテキストを返します。
   */
  public getElementFromSelection(): string {
    const range = this.selectionService.getFirstRange();
    if (!range) {
      return '';
    }

    const element = this.findOptimalElement(range);

    return element ? element.outerHTML : this.selectionService.getSelectedText();
  }

  /**
   * 指定されたRangeから最適な要素を見つけ出します。
   * @param range - ユーザーの選択範囲。
   * @returns 最適なHTML要素。見つからない場合はnull。
   */
  private findOptimalElement(range: Range): Element | null {
    const { commonAncestorContainer } = range;

    if (this.isInvalidAncestor(commonAncestorContainer)) {
      return this.getFallbackElement(range);
    }

    return this.findContainingElement(range, commonAncestorContainer);
  }

  /**
   * 共通祖先コンテナが無効（documentやbody）かどうかを判定します。
   * @param container - 判定対象のノード。
   * @returns 無効な場合はtrue。
   */
  private isInvalidAncestor(container: Node): boolean {
    return container === document || container === document.body;
  }

  /**
   * 選択範囲を完全に包含する、最も内側にある適切な要素を見つけます。
   * @param range - ユーザーの選択範囲。
   * @param container - 共通祖先コンテナ。
   * @returns 発見されたHTML要素。見つからない場合はnull。
   */
  private findContainingElement(range: Range, container: Node): Element | null {
    if (container.nodeType === NODE_TYPES.TEXT_NODE) {
      return this.findTargetElement(container.parentElement);
    }

    const element = container as Element;
    if (this.isMultiElementSelection(range)) {
      return this.findTargetElement(element);
    }

    const startElement = this.getStartElement(range);
    return this.findTargetElement(startElement);
  }

  /**
   * 指定された要素またはその祖先から、置換対象として適切な要素を探します。
   * @param element - 探索を開始する要素。
   * @returns 発見されたHTML要素。見つからない場合は探索開始要素。
   */
  private findTargetElement(element: Element | null): Element | null {
    let current = element;
    while (current && current !== document.body) {
      if (this.isSuitableAsTarget(current)) {
        return current;
      }
      current = current.parentElement;
    }
    return element; // 見つからなければ元の要素を返す
  }

  /**
   * 選択範囲の開始コンテナから要素を取得します。
   * @param range - ユーザーの選択範囲。
   * @returns 開始要素。
   */
  private getStartElement(range: Range): Element | null {
    const { startContainer } = range;
    if (startContainer.nodeType === NODE_TYPES.TEXT_NODE) {
      return startContainer.parentElement;
    }
    return startContainer as Element;
  }

  /**
   * 選択が複数の要素にまたがっているかを判定します。
   * @param range - ユーザーの選択範囲。
   * @returns 複数要素にまたがる場合はtrue。
   */
  private isMultiElementSelection(range: Range): boolean {
    return range.startContainer !== range.endContainer;
  }

  /**
   * 指定された要素が置換対象として適切かどうかを判定します。
   * インライン要素や属性を持つ要素を優先します。
   * @param element - 判定対象の要素。
   * @returns 適切な場合はtrue。
   */
  private isSuitableAsTarget(element: Element): boolean {
    const tagName = element.tagName?.toLowerCase();
    const inlineElements = ['span', 'a', 'strong', 'b', 'em', 'i', 'code', 'small', 'mark'];

    if (inlineElements.includes(tagName)) {
      return true;
    }
    return element.hasAttributes() && element.attributes.length > 0;
  }

  /**
   * フォールバックとして、選択範囲の開始点にある要素を取得します。
   * @param range - ユーザーの選択範囲。
   * @returns フォールバック用のHTML要素。
   */
  private getFallbackElement(range: Range): Element | null {
    const element = this.getStartElement(range);
    if (element && element !== document.body) {
      return element;
    }
    return null;
  }
}
