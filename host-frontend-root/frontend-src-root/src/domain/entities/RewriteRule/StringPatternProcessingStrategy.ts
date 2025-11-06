import { RegexConstants } from "src/domain/constants/RegexConstants";
import { PatternProcessingStrategy } from "src/domain/entities/RewriteRule/PatternProcessingStrategy";

/**
 * 文字列パターン処理戦略
 * 正規表現フラグがfalseの場合のパターン処理を担当
 */
export class StringPatternProcessingStrategy implements PatternProcessingStrategy {
  private readonly oldString: string;

  constructor(oldString: string) {
    this.oldString = oldString;
  }

  /**
   * 文字列パターンを処理する
   * 文字列の場合は正規表現特殊文字をエスケープして返す
   * メンバ変数として保持したoldStringを使用
   * @returns エスケープされたパターン文字列
   * 使用するメンバ変数: oldString
   */
  public processPattern(): string {
    return this.escapeRegexSpecialCharacters(this.oldString);
  }

  /**
   * 正規表現の特殊文字をエスケープする
   * @param pattern エスケープ対象の文字列
   * @returns エスケープされた文字列
   */
  private escapeRegexSpecialCharacters(pattern: string): string {
    return pattern.replace(
      RegexConstants.REGEX_SPECIAL_CHARACTERS_PATTERN,
      RegexConstants.ESCAPED_SPECIAL_CHARACTER_REPLACEMENT
    );
  }
}
