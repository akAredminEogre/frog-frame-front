export class RewriteRule {
  constructor(
    public readonly id: string,
    public readonly oldString: string,
    public readonly newString: string,
    public readonly urlPattern?: string,
    public readonly isRegex?: boolean
  ) {}

  /**
   * 新しい文字列が検索対象文字列を含んでいるかを判定する
   * 無限ループを防ぐために使用される
   */
  public wouldCauseInfiniteLoop(): boolean {
    return this.newString.includes(this.oldString);
  }

}
