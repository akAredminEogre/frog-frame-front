export class CurrentUrl {
  private readonly _value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error('Current URL cannot be empty');
    }
    if (!this.isValidUrl(value)) {
      throw new Error('Invalid URL format');
    }
    
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
