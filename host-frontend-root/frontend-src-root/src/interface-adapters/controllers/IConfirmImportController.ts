import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

export interface IConfirmImportController {
  confirmImport(validatedRules: RewriteRule[]): Promise<void>;
}
