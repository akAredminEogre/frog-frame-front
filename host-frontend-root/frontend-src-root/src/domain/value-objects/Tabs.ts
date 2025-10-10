import { Tab } from 'src/domain/value-objects/Tab';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * Tabのファーストクラスコレクション
 */
export class Tabs {
  private readonly _tabs: ReadonlyArray<Tab>;

  constructor(tabs: Tab[]) {
    this._tabs = Object.freeze([...tabs]);
  }

  /**
   * ルールにマッチするタブのみをフィルタリング
   */
  filterByRule(rule: RewriteRule): Tabs {
    const filteredTabs = this._tabs.filter(tab => tab.matchesRule(rule));
    return new Tabs(filteredTabs);
  }

  /**
   * コレクション内のタブの配列を取得
   */
  toArray(): ReadonlyArray<Tab> {
    return this._tabs;
  }
}
