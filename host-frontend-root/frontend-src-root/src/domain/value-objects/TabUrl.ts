export class TabUrl {
  private readonly _value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error('Tab URL cannot be empty');
    }
    
    const url = new URL(value);
    
    // HTTPとHTTPSのみ許可
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(url.protocol)) {
      throw new Error('Tab URL must use http:// or https:// protocol');
    }
    
    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}
