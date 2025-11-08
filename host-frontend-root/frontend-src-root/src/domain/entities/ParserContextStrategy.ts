/**
 * テーブル要素の種類を表すenum
 */
enum TableElementType {
  TR = 'tr',
  TD = 'td',
  TH = 'th',
  THEAD = 'thead',
  TBODY = 'tbody',
  TFOOT = 'tfoot'
}

/**
 * パーサーコンテキスト戦略ファクトリー
 * 要素の種類に応じて適切なHTMLパーサーコンテナを直接作成する
 */
export class ParserContextStrategyFactory {
  private static readonly containerCreators = new Map<string, () => HTMLElement>([
    [TableElementType.TR, () => ParserContextStrategyFactory.createTbodyInTable()],
    [TableElementType.TD, () => ParserContextStrategyFactory.createTrInTbodyInTable()],
    [TableElementType.TH, () => ParserContextStrategyFactory.createTrInTbodyInTable()],
    [TableElementType.THEAD, () => ParserContextStrategyFactory.createTable()],
    [TableElementType.TBODY, () => ParserContextStrategyFactory.createTable()],
    [TableElementType.TFOOT, () => ParserContextStrategyFactory.createTable()]
  ]);
  
  /**
   * 要素に基づいて適切なHTMLパーサーコンテナを作成する
   * @param element 対象となる要素
   * @returns 適切なコンテキストを持つHTMLコンテナ要素
   */
  static createContainer(element: Element): HTMLElement {
    const tagName = element.tagName.toLowerCase();
    const creator = this.containerCreators.get(tagName);
    
    if (creator) {
      return creator();
    }
    
    // デフォルトはdivコンテナ
    return document.createElement('div');
  }

  /**
   * table要素を作成する
   * @returns table要素
   */
  private static createTable(): HTMLElement {
    return document.createElement('table');
  }

  /**
   * table > tbody の構造を作成してtbodyを返す
   * @returns tbody要素（tableに配置済み）
   */
  private static createTbodyInTable(): HTMLElement {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    return tbody;
  }

  /**
   * table > tbody > tr の構造を作成してtrを返す
   * @returns tr要素（tbody > table階層に配置済み）
   */
  private static createTrInTbodyInTable(): HTMLElement {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    tbody.appendChild(tr);
    table.appendChild(tbody);
    return tr;
  }
}