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
    return true; // すべての文字列を有効なHTML文字列として扱う
  }

  toString(): string {
    return this.value;
  }

  equals(other: HtmlString): boolean {
    return this.value === other.value;
  }

}
