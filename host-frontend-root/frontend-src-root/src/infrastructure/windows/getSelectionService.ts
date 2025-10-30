import { IGetSelectionService } from 'src/application/ports/IGetSelectionService';

/**
 * ブラウザのSelection APIを抽象化するインフラストラクチャサービス。
 * window.getSelection()への直接アクセスを避け、テスト容易性を向上させます。
 * IGetSelectionServiceインターフェースを実装し、依存性の逆転の原則に従います。
 */
export class GetSelectionService implements IGetSelectionService {
  /**
   * 現在のユーザー選択範囲を取得します。
   * @returns 現在のSelectionオブジェクト。
   */
  private getCurrentSelection(): Selection {
    return window.getSelection()!;
  }

  /**
   * 選択範囲が存在し、有効な範囲を持っているかを確認します。
   * @returns 有効な選択範囲が存在する場合はtrue。
   */
  private hasValidSelection(): boolean {
    const selection = this.getCurrentSelection();
    return selection.rangeCount > 0;
  }

  /**
   * 現在の選択範囲の最初のRangeオブジェクトを取得します。
   * @returns 最初のRangeオブジェクト。選択が存在しない場合はnull。
   */
  public getFirstRange(): Range | null {
    if (!this.hasValidSelection()) {
      return null;
    }
    const selection = this.getCurrentSelection();
    return selection.getRangeAt(0);
  }

  /**
   * 選択範囲のテキスト内容を取得します。
   * @returns 選択されたテキスト。
   */
  public getSelectedText(): string {
    const selection = this.getCurrentSelection();
    return selection.toString();
  }
}