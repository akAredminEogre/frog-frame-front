/**
 * ユーザーのテキスト選択範囲から、置換対象となる最適なHTML要素を特定するドメインエンティティ。
 * 複雑なDOM構造や複数ノードにまたがる選択に対応し、最小かつ意味のある要素を返却します。
 */
export class ElementSelector {
  /**
   * 指定された選択範囲から最適なHTML要素を取得します。
   * @param range - ユーザーの選択範囲
   * @param selectedText - 選択されたテキスト（フォールバック用）
   * @returns 発見された要素のouterHTML。適切な要素が見つからない場合は選択範囲のテキストを返します。
   */
  public getElementFromSelection(range: Range, selectedText: string): string {
    const element = this.findOptimalElement(range);

    return element ? element.outerHTML : selectedText;
  }

  /**
   * 指定されたRangeから最適な要素を見つけ出します。
   * @param range - ユーザーの選択範囲。
   * @returns 最適なHTML要素。見つからない場合はnull。
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
   * 選択範囲を完全に包含する要素を見つけます。
   * @param range - ユーザーの選択範囲。
   * @param container - 共通祖先コンテナ。
   * @returns 発見されたHTML要素。見つからない場合はnull。
   */
  private findContainingElement(range: Range, container: Node): Element | null {
    if (container.nodeType === Node.TEXT_NODE) {
      return container.parentElement;
    }

    const element = container as Element;
    if (this.isMultiElementSelection(range)) {
      return element;
    }

    return this.getStartElement(range);
  }

  /**
   * 選択範囲の開始コンテナから要素を取得します。
   * @param range - ユーザーの選択範囲。
   * @returns 開始要素。
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

}
