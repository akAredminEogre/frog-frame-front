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

    // 選択範囲を含む最適な要素を特定
    const targetElement = this.findContainingElement(range, commonAncestorContainer);

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
   * 選択範囲を含む最適な要素を特定する
   * span要素内の複数テキストノードに対応し、適切な親要素を遡及する
   */
  private findContainingElement(range: Range, commonAncestorContainer: Node): Element | null {
    // 共通祖先がテキストノードの場合は親要素を取得
    if (commonAncestorContainer.nodeType === Node.TEXT_NODE) {
      return this.findTargetElementFromTextNode(commonAncestorContainer);
    }
    
    // 共通祖先が要素ノードの場合
    const ancestorElement = commonAncestorContainer as Element;
    
    // 複数要素にまたがる選択の場合、共通祖先を優先
    if (this.isMultiElementSelection(range)) {
      return ancestorElement;
    }
    
    // span要素など特定のインライン要素の場合はそのまま返す
    if (this.isTargetElement(ancestorElement)) {
      return ancestorElement;
    }
    
    // 選択範囲の開始点から適切な親要素を探す
    return this.findTargetElementFromRange(range);
  }

  /**
   * テキストノードから適切な親要素を特定する
   */
  private findTargetElementFromTextNode(textNode: Node): Element | null {
    const parentElement = (textNode as Text).parentElement;
    if (!parentElement) {
      return null;
    }
    
    // span要素など、置換対象として適切な要素の場合はそれを返す
    if (this.isTargetElement(parentElement)) {
      return parentElement;
    }
    
    // より上位の親要素を探す
    return this.findParentTargetElement(parentElement);
  }

  /**
   * 選択範囲から適切な要素を特定する
   */
  private findTargetElementFromRange(range: Range): Element | null {
    const startContainer = range.startContainer;
    
    if (startContainer.nodeType === Node.TEXT_NODE) {
      return this.findTargetElementFromTextNode(startContainer);
    }
    
    const startElement = startContainer as Element;
    
    if (this.isTargetElement(startElement)) {
      return startElement;
    }
    
    return this.findParentTargetElement(startElement);
  }

  /**
   * 親要素を遡って適切なターゲット要素を見つける
   */
  private findParentTargetElement(element: Element): Element | null {
    let currentElement: Element | null = element;
    
    while (currentElement && currentElement !== document.body) {
      if (this.isTargetElement(currentElement)) {
        return currentElement;
      }
      currentElement = currentElement.parentElement;
    }
    
    // 適切なターゲット要素が見つからない場合は最初の要素を返す
    return element;
  }

  /**
   * 複数要素にまたがる選択かを判定する
   */
  private isMultiElementSelection(range: Range): boolean {
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    
    // 開始と終了が異なるコンテナの場合は複数要素選択
    if (startContainer !== endContainer) {
      return true;
    }
    
    // 開始と終了が同じでも、親要素が異なる場合は複数要素選択の可能性
    if (startContainer.nodeType === Node.TEXT_NODE && endContainer.nodeType === Node.TEXT_NODE) {
      const startParent = (startContainer as Text).parentElement;
      const endParent = (endContainer as Text).parentElement;
      return startParent !== endParent;
    }
    
    return false;
  }

  /**
   * 要素が置換対象として適切かを判定する
   */
  private isTargetElement(element: Element): boolean {
    const tagName = element.tagName?.toLowerCase();
    
    // span要素は常に対象
    if (tagName === 'span') {
      return true;
    }
    
    // その他のインライン要素も対象とする
    const inlineElements = ['a', 'strong', 'b', 'em', 'i', 'code', 'small', 'mark'];
    if (inlineElements.includes(tagName)) {
      return true;
    }
    
    // classやid等の属性がある要素も対象とする
    if (typeof element.hasAttributes === 'function' && element.hasAttributes()) {
      return true;
    }
    
    // hasAttributesメソッドが存在しない場合は、attributes lengthで判定
    if (element.attributes && element.attributes.length > 0) {
      return true;
    }
    
    return false;
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
