export class TabUrl {
  private readonly _value: string;

  /**
   * URL schemes that cannot have content scripts injected
   * Based on Chrome extension content script restrictions
   */
  private static readonly RESTRICTED_SCHEMES = [
    'chrome:',
    'chrome-extension:',
    'devtools:',
    'view-source:',
    'about:',
    'data:',
  ] as const;

  /**
   * Special URLs that cannot have content scripts injected
   */
  private static readonly RESTRICTED_URLS = [
    'https://chrome.google.com/webstore/',
  ] as const;

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

  /**
   * Check if content script can be injected into this URL
   *
   * @returns true if content script can be injected, false otherwise
   */
  public canInjectContentScript(): boolean {
    return this.isNotRestrictedScheme() && this.isNotRestrictedUrl();
  }

  private isNotRestrictedScheme(): boolean {
    return !TabUrl.RESTRICTED_SCHEMES.some((scheme) =>
      this._value.startsWith(scheme)
    );
  }

  private isNotRestrictedUrl(): boolean {
    return !TabUrl.RESTRICTED_URLS.some((restrictedUrl) =>
      this._value.startsWith(restrictedUrl)
    );
  }
}
