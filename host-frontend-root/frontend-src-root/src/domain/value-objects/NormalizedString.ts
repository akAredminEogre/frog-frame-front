export class NormalizedString {
  private readonly value: string;

  constructor(text: string) {
    this.value = this.normalize(text);
  }

  private normalize(text: string): string {
    // すべての空白文字（改行、タブ、空白）を完全に除去して比較用の文字列を作成
    return text.replace(/\s+/g, '');
  }

  equals(other: NormalizedString): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  indexOf(searchString: NormalizedString): number {
    return this.value.indexOf(searchString.value);
  }

  replace(searchString: NormalizedString, replaceString: string): string {
    return this.value.replace(searchString.value, replaceString);
  }
}
