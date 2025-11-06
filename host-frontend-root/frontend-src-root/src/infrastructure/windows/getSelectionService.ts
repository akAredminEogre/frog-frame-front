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
   * 現在の選択範囲の最初のRangeオブジェクトを取得します。
   * @returns 最初のRangeオブジェクト。
   */
  public getFirstRange(): Range {
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