import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

export class ConfirmImportInputData {
  constructor(public readonly validatedRules: RewriteRule[]) {}
}
