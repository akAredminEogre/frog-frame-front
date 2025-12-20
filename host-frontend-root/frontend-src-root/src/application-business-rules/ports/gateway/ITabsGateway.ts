import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * ブラウザタブ操作のGatewayインターフェース
 */
export interface ITabsGateway {
  /**
   * 指定されたルールのURLパターンにマッチするタブをリロードする
   * @param rule マッチング判定に使用するRewriteRule
   */
  reloadMatchingTabs(rule: RewriteRule): Promise<void>;
}
