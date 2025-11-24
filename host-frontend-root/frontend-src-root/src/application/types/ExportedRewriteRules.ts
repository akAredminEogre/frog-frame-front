/**
 * エクスポートされるルールの型定義（idを含まない）
 */
export interface ExportedRewriteRule {
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
  isActive: boolean;
}

/**
 * エクスポート/インポート用のJSON形式
 */
export interface ExportedRewriteRules {
  version: string;
  exportDate: string;
  rules: ExportedRewriteRule[];
}
