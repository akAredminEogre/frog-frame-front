/**
 * ブラウザのSelection APIを抽象化するインフラストラクチャサービス。
 * window.getSelection()への直接アクセスを避け、テスト容易性を向上させます。
 */
export class SelectionService {
  /**
   * 現在のユーザー選択範囲を取得します。
   * @returns 現在のSelectionオブジェクト。選択が存在しない場合はnull。
   */
  public getCurrentSelection(): Selection | null {
    return window.getSelection();
  }

  /**
   * 選択範囲が存在し、有効な範囲を持っているかを確認します。
   * @returns 有効な選択範囲が存在する場合はtrue。
   */
  public hasValidSelection(): boolean {
    const selection = this.getCurrentSelection();
    return !!(selection && selection.rangeCount > 0);
  }

  /**
   * 現在の選択範囲の最初のRangeオブジェクトを取得します。
   * @returns 最初のRangeオブジェクト。選択が存在しない場合はnull。
   */
  public getFirstRange(): Range | null {
    const selection = this.getCurrentSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }
    return selection.getRangeAt(0);
  }

  /**
   * 選択範囲のテキスト内容を取得します。
   * @returns 選択されたテキスト。選択が存在しない場合は空文字列。
   */
  public getSelectedText(): string {
    const selection = this.getCurrentSelection();
    return selection ? selection.toString() : '';
  }
}
