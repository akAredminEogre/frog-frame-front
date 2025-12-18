import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * ルールの有効/無効切り替えの出力データ
 * 更新後のルールエンティティを保持
 */
export class ToggleRuleActiveOutputData {
  constructor(
    public readonly toggledRule: RewriteRule
  ) {}
}
