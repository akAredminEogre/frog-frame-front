/**
 * ブラウザのSelection APIを抽象化するインターフェース。
 * 依存性の逆転の原則に従い、application層がinfrastructure層に依存することなく
 * 選択範囲操作を行えるようにします。
 */
export interface IGetSelectionService {
  /**
   * 現在の選択範囲の最初のRangeオブジェクトを取得します。
   * @returns 最初のRangeオブジェクト。選択が存在しない場合はnull。
   */
  getFirstRange(): Range | null;

  /**
   * 選択範囲のテキスト内容を取得します。
   * @returns 選択されたテキスト。選択が存在しない場合は空文字列。
   */
  getSelectedText(): string;
}