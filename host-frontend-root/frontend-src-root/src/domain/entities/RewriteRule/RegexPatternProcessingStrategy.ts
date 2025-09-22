import { PatternProcessingStrategy } from "./PatternProcessingStrategy";

/**
 * 正規表現パターン処理戦略
 * 正規表現フラグがtrueの場合のパターン処理を担当
 */
export class RegexPatternProcessingStrategy implements PatternProcessingStrategy {
  private readonly oldString: string;

  constructor(oldString: string) {
    this.oldString = oldString;
  }

  /**
   * 正規表現パターンを処理する
   * 正規表現の場合はエスケープ処理を行わずにそのまま返す
   * メンバ変数として保持したoldStringを使用
   * @returns 処理されたパターン文字列
   * 使用するメンバ変数: oldString
   */
  public processPattern(): string {
    return this.oldString;
  }
}
