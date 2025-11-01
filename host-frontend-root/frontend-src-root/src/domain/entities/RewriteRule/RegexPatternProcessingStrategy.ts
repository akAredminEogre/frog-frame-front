import { PatternProcessingStrategy } from "src/domain/entities/RewriteRule/PatternProcessingStrategy";

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
   * 正規表現の場合は、CSS attribute値内の角括弧のみエスケープして、
   * 正規表現文字クラスの角括弧はエスケープしない
   * メンバ変数として保持したoldStringを使用
   * @returns 処理されたパターン文字列
   * 使用するメンバ変数: oldString
   */
  public processPattern(): string {
    return this.escapeCssAttributeBrackets(this.oldString);
  }

  /**
   * CSS属性値内の角括弧のみエスケープする
   * Tailwind CSS等の角括弧記法を正規表現で正しく処理するため
   * class="...w-[200px]..." のような場合のみ角括弧をエスケープ
   * @param pattern エスケープ対象の文字列
   * @returns CSS属性値内の角括弧のみエスケープされた文字列
   */
  private escapeCssAttributeBrackets(pattern: string): string {
    // CSS class attribute内での角括弧記法（例：w-[200px]）をエスケープ
    // 文字クラス（例：[a-z]）と区別するため、より具体的なパターンマッチングを使用
    return pattern.replace(/(\w-)\[([^\]]+)\]/g, '$1\\[$2\\]');
  }
}
