export class NormalizedString {
  private readonly value: string;

  constructor(text: string) {
    this.value = this.normalize(text);
  }

  private normalize(text: string): string {
    // HTMLタグの前後の空白のみを除去（属性やテキスト内容は保持）
    return text.replace(/\s*</g, '<').replace(/>\s*/g, '>');
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
