/**
 * ユーザーのテキスト選択範囲から、置換対象となる最適なHTML要素を特定するドメインエンティティ。
 * 複雑なDOM構造や複数ノードにまたがる選択に対応し、最小かつ意味のある要素を返却します。
 */
export class ElementSelector {
  /**
   * 指定された選択範囲から最適なHTML要素を取得します。
   * @param range - ユーザーの選択範囲
   * @param selectedText - 選択されたテキスト（適切な要素が見つからない場合にそのまま返却）
   * @returns 発見された要素のouterHTML、または適切な要素が見つからない場合はselectedText。
   */
  public getElementFromSelection(range: Range, selectedText: string): string {
    const element = this.findOptimalElement(range);

    return element ? element.outerHTML : selectedText;
  }

  /**
   * 指定されたRangeから最適な要素を見つけ出します。
   * @param range - ユーザーの選択範囲。
   * @returns 最適なHTML要素、または適切な要素が見つからない場合はnull。
   */
  private findOptimalElement(range: Range): Element | null {
    const { commonAncestorContainer } = range;

    if (this.isInvalidAncestor(commonAncestorContainer)) {
      return this.getStartElement(range);
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
   * @returns 発見されたHTML要素、または適切な要素が見つからない場合はnull。
   */
  private findContainingElement(range: Range, container: Node): Element | null {
    if (container.nodeType === Node.TEXT_NODE) {
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
   * @returns 開始要素、または適切な要素が見つからない場合はnull。
   */
  private getStartElement(range: Range): Element | null {
    const { startContainer } = range;
    if (startContainer.nodeType === Node.TEXT_NODE) {
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
   * 指定された要素がテーブル要素かどうかを判定します。
   * @param element - 判定対象の要素。
   * @returns テーブル要素の場合はtrue。
   */
  private isTableElement(element: Element): boolean {
    const tagName = element.tagName?.toLowerCase();
    const tableElements = ['table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot'];
    return tableElements.includes(tagName);
  }

  /**
   * 指定された要素がテーブル内にあるかどうかを判定します。
   * @param element - 判定対象の要素。
   * @returns テーブル内にある場合はtrue。
   */
  private isWithinTable(element: Element): boolean {
    let current: Element | null = element;
    while (current && current !== document.body) {
      if (current.tagName?.toLowerCase() === 'table') {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }

  /**
   * 指定された要素が置換対象として適切かどうかを判定します。
   * インライン要素や属性を持つ要素を優先します。
   * テーブル内の場合は特別な処理を行います。
   * @param element - 判定対象の要素。
   * @returns 適切な場合はtrue。
   */
  private isSuitableAsTarget(element: Element): boolean {
    const tagName = element.tagName?.toLowerCase();
    const inlineElements = ['span', 'a', 'strong', 'b', 'em', 'i', 'code', 'small', 'mark'];

    // テーブル内の場合の特別処理
    if (this.isWithinTable(element)) {
      // テーブル内ではtr要素のみを適切とする
      if (tagName === 'tr') {
        return true;
      }
      // tr要素以外のテーブル要素（table, td, th, tbody, thead, tfoot）は適切でない
      if (this.isTableElement(element)) {
        return false;
      }
      // テーブル内のインライン要素も適切でない（tr要素まで遡及させる）
      if (inlineElements.includes(tagName)) {
        return false;
      }
    }

    // 通常の処理
    if (inlineElements.includes(tagName)) {
      return true;
    }
    return element.hasAttributes() && element.attributes.length > 0;
  }

}
