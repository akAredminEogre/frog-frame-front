/**
 * RewriteRuleの更新/作成時に使用するパラメータ型
 */
export interface RewriteRuleParams {
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
  isActive?: boolean;
}
