export class TabUrl {
  private readonly _value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error('Tab URL cannot be empty');
    }
    
    try {
      const url = new URL(value);
      // HTTPとHTTPSのみ許可
      const allowedProtocols = ['http:', 'https:'];
      if (!allowedProtocols.includes(url.protocol)) {
        throw new Error('Tab URL must use http:// or https:// protocol');
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Invalid URL format');
      }
      throw error;
    }
    
    this._value = value;
  }

  getValue(): string {
    return this._value;
  }
}
