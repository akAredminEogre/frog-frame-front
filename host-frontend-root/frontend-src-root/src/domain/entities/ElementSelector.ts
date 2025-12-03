import { IDomRootChecker } from 'src/domain/ports/IDomRootChecker';

/**
 * ユーザーのテキスト選択範囲から、置換対象となる最適なHTML要素を特定するドメインエンティティ。
 * 複雑なDOM構造や複数ノードにまたがる選択に対応し、最小かつ意味のある要素を返却します。
 */
export class ElementSelector {
  private domRootChecker: IDomRootChecker;

  constructor(domRootChecker: IDomRootChecker) {
    this.domRootChecker = domRootChecker;
  }
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
   *
   * Node型はブラウザDOM APIの型ですが、Chrome拡張機能ではDOM操作がビジネスロジックの
   * 本質であるため、データ構造体としてDomain層での使用を許容しています。
   * ただし、グローバルオブジェクト（document等）への直接アクセスはIDomRootCheckerを
   * 通じてInfrastructure層に委譲し、依存性逆転の原則に従っています。
   *
   * @param container - 判定対象のノード。
   * @returns 無効な場合はtrue。
   */
  private isInvalidAncestor(container: Node): boolean {
    return this.domRootChecker.isDocumentRoot(container);
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
