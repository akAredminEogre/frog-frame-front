export class ReplacementValue {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  isHtml(): boolean {
    return /<[a-z][\s\S]*>/i.test(this.value);
  }

  toString(): string {
    return this.value;
  }
}
