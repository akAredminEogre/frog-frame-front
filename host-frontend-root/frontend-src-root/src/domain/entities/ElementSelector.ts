/**
 * 選択されたテキストを含む最小のHTML要素を特定するドメインエンティティ
 */
export class ElementSelector {
  /**
   * 選択されたテキストを含む最小のHTML要素を特定する
   * @returns 選択されたHTML要素のouterHTMLまたはフォールバック文字列
   */
  public getElementFromSelection(): string {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return '';
    }

    const range = selection.getRangeAt(0);
    const { commonAncestorContainer } = range;

    // 共通祖先が適切でない場合（ドキュメントルートなど）の処理
    if (commonAncestorContainer === document || commonAncestorContainer === document.body) {
      return this.getFirstElementFromSelection(range, selection);
    }

    // テキストノードの場合は親要素を取得
    const targetElement = this.getTargetElement(commonAncestorContainer);

    // 選択されたテキストが複数の要素にまたがる場合、最も近い親要素を返す
    if (targetElement) {
      return targetElement.outerHTML;
    }

    // フォールバック：選択範囲の最初の要素のみを対象
    return this.getFallbackElement(range, selection);
  }

  /**
   * 選択範囲の最初の要素を返す（共通祖先が適切でない場合）
   */
  private getFirstElementFromSelection(range: Range, selection: Selection): string {
    const startContainer = range.startContainer;
    const targetElement = startContainer.nodeType === Node.TEXT_NODE 
      ? startContainer.parentElement 
      : startContainer as Element;
    
    if (targetElement && targetElement !== document.body) {
      return targetElement.outerHTML;
    }
    return selection.toString();
  }

  /**
   * 共通祖先からターゲット要素を取得
   */
  private getTargetElement(commonAncestorContainer: Node): Element | null {
    if (commonAncestorContainer.nodeType === Node.TEXT_NODE) {
      return commonAncestorContainer.parentElement;
    } else {
      return commonAncestorContainer as Element;
    }
  }

  /**
   * フォールバック処理：選択範囲の最初の要素のみを対象とする
   */
  private getFallbackElement(range: Range, selection: Selection): string {
    const startContainer = range.startContainer;
    const fallbackElement = startContainer.nodeType === Node.TEXT_NODE 
      ? startContainer.parentElement 
      : startContainer as Element;
    
    if (fallbackElement && fallbackElement !== document.body) {
      return fallbackElement.outerHTML;
    }

    return selection.toString();
  }
}
