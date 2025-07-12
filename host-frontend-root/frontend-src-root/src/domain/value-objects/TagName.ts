export class TagName {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid tag name');
    }
    this.value = value.toLowerCase();
  }

  private isValid(value: string): boolean {
    // HTMLタグ名として妥当な形式かチェック（簡易版）
    return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: TagName): boolean {
    return this.value === other.value;
  }

  isTableRelated(): boolean {
    return ['tbody', 'thead', 'tfoot', 'tr', 'td', 'th', 'caption'].includes(this.value);
  }
}
