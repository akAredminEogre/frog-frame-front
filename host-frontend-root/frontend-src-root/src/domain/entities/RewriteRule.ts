export type RewriteRule = {
  id: string;
  oldString: string;
  newString: string;
  urlPattern?: string;
  isRegex?: boolean;
};
