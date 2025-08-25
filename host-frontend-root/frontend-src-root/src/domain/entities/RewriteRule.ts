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

  /**
   * プレーンオブジェクトからRewriteRuleインスタンスを作成するファクトリメソッド
   */
  static fromPlainObject(obj: {
    id: string;
    oldString: string;
    newString: string;
    urlPattern?: string;
    isRegex?: boolean;
  }): RewriteRule {
    return new RewriteRule(
      obj.id,
      obj.oldString,
      obj.newString,
      obj.urlPattern,
      obj.isRegex
    );
  }
}

/**
 * プレーンオブジェクトの型定義（JSONから取得される形式）
 */
export type RewriteRulePlainObject = {
  id: string;
  oldString: string;
  newString: string;
  urlPattern?: string;
  isRegex?: boolean;
};
