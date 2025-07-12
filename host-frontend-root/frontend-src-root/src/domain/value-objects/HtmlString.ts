import { TagName } from './TagName';

export class HtmlString {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid HTML string');
    }
    this.value = value;
  }

  private isValid(value: string): boolean {
    // 簡単なチェック：空でないこと、およびHTMLタグの基本的な形式を持つこと
    return value.trim().length > 0 && /<[a-z][\s\S]*>/i.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: HtmlString): boolean {
    return this.value === other.value;
  }

  /**
   * HTML文字列をDOMノードに変換します。
   * @param tagNameContext - 変換コンテキストとして使用されるタグ名
   * @returns 変換されたDOMノード
   */
  toDomNode(tagNameContext: string): Node {
    const tagName = new TagName(tagNameContext);

    if (tagName.isTableRelated()) {
      return this.createNodeForTable(tagName);
    }
    return this.createNodeFromDiv();
  }

  private createNodeFromDiv(): Node {
    const div = document.createElement('div');
    div.innerHTML = this.value;
    return div.firstChild!;
  }

  private createNodeForTable(tagName: TagName): Node {
    const table = document.createElement('table');
    const tempContainer = this.getTableContainer(table, tagName);
    tempContainer.innerHTML = this.value;
    return tempContainer.firstChild!;
  }

  private getTableContainer(table: HTMLTableElement, tagName: TagName): HTMLElement {
    if (tagName.toString() === 'td' || tagName.toString() === 'th') {
      return table.createTBody().insertRow();
    }
    if (tagName.toString() === 'tr') {
      return table.createTBody();
    }
    return table;
  }
}
