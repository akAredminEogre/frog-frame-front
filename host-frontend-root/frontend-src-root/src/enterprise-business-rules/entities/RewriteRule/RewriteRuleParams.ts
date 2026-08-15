/**
 * RewriteRuleの更新/作成時に使用するパラメータ型
 *
 * Clean Architecture の依存規則（依存は内向き＝entities へ向かう）に従い、
 * 本入力型は最内層 Enterprise Business Rules（RewriteRule エンティティ近傍）が所有する。
 * application 層以下の外層はこの型を EBR から参照する（内向き依存）。
 */
export interface RewriteRuleParams {
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
  isActive?: boolean;
}
