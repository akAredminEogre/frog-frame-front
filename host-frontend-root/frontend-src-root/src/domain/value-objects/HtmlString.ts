export class HtmlString {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid HTML string');
    }
    this.value = value;
  }

  private isValid(_value: string): boolean {
    // 常にtrueを返す実装
    // 理由：
    // 1. 現状仕様が固まっておらず、バリデーション要件が不明確
    // 2. HTMLとしては不正であっても不完全な入力値も受け入れなければいけない可能性がある
    // 3. 将来的な仕様変更に柔軟に対応するため、現時点では制限を設けない
    return true;
  }

  toString(): string {
    return this.value;
  }

  equals(other: HtmlString): boolean {
    return this.value === other.value;
  }

}
