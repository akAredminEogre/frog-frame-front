import { IElementFactory } from 'src/domain/ports/IElementFactory';

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
 * 要素の種類に応じて適切なHTMLパーサーコンテナを作成する
 * 依存性の逆転の原則に従い、IElementFactoryを通じて要素を生成する
 */
export class ParserContextStrategyFactory {
  private elementFactory: IElementFactory;
  private readonly containerCreators: Map<string, () => HTMLElement>;

  constructor(elementFactory: IElementFactory) {
    this.elementFactory = elementFactory;
    this.containerCreators = new Map<string, () => HTMLElement>([
      [TableElementType.TR, () => this.createTbodyInTable()],
      [TableElementType.TD, () => this.createTrInTbodyInTable()],
      [TableElementType.TH, () => this.createTrInTbodyInTable()],
      [TableElementType.THEAD, () => this.createTable()],
      [TableElementType.TBODY, () => this.createTable()],
      [TableElementType.TFOOT, () => this.createTable()]
    ]);
  }

  /**
   * 要素に基づいて適切なHTMLパーサーコンテナを作成する
   * @param element 対象となる要素
   * @returns 適切なコンテキストを持つHTMLコンテナ要素
   */
  createContainer(element: Element): HTMLElement {
    const tagName = element.tagName.toLowerCase();
    const creator = this.containerCreators.get(tagName);

    if (creator) {
      return creator();
    }

    // デフォルトはdivコンテナ
    return this.elementFactory.createElement('div');
  }

  /**
   * table要素を作成する
   * @returns table要素
   */
  private createTable(): HTMLElement {
    return this.elementFactory.createElement('table');
  }

  /**
   * table > tbody の構造を作成してtbodyを返す
   * @returns tbody要素（tableに配置済み）
   */
  private createTbodyInTable(): HTMLElement {
    const table = this.elementFactory.createElement('table');
    const tbody = this.elementFactory.createElement('tbody');
    table.appendChild(tbody);
    return tbody;
  }

  /**
   * table > tbody > tr の構造を作成してtrを返す
   * @returns tr要素（tbody > table階層に配置済み）
   */
  private createTrInTbodyInTable(): HTMLElement {
    const table = this.elementFactory.createElement('table');
    const tbody = this.elementFactory.createElement('tbody');
    const tr = this.elementFactory.createElement('tr');
    tbody.appendChild(tr);
    table.appendChild(tbody);
    return tr;
  }
}