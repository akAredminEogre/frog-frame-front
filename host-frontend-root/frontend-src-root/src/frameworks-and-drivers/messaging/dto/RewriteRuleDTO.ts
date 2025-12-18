/**
 * RewriteRuleのDTO（Data Transfer Object）
 * Chrome Runtime APIでのメッセージングに使用
 */
export interface RewriteRuleDTO {
  id: number;
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
  isActive: boolean;
}
