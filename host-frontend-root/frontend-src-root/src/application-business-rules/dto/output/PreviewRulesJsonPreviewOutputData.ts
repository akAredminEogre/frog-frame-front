import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * ルールJSONプレビュー確認ダイアログ用データ
 * 現在のルール件数・インポート後の件数に加え、バリデーション済みルール配列を保持する。
 * validatedRules はプレビュー確定後に Factory 経由で ConfirmImportInteractor.setPendingRules() に渡される。
 */
export class PreviewRulesJsonPreviewOutputData {
  constructor(
    public readonly currentRuleCount: number,
    public readonly importRuleCount: number,
    public readonly validatedRules: RewriteRule[]
  ) {}
}
