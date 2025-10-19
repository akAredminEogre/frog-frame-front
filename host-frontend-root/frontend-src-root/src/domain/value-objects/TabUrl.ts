export class TabUrl {
  private readonly _value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error('Tab URL cannot be empty');
    }
    
    const url = new URL(value);
    
    // HTTP、HTTPS、Chrome関連プロトコルを許可
    const allowedProtocols = ['http:', 'https:', 'chrome:', 'chrome-extension:'];
    if (!allowedProtocols.includes(url.protocol)) {
      throw new Error('Tab URL must use http://, https://, chrome://, or chrome-extension:// protocol');
    }
    
    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}
