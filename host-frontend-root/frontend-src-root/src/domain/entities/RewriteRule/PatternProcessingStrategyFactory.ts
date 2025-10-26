import { PatternProcessingStrategy } from "src/domain/entities/RewriteRule/PatternProcessingStrategy";
import { RegexPatternProcessingStrategy } from "src/domain/entities/RewriteRule/RegexPatternProcessingStrategy";
import { StringPatternProcessingStrategy } from "src/domain/entities/RewriteRule/StringPatternProcessingStrategy";

/**
 * パターン処理戦略のファクトリクラス
 * RewriteRuleのフラグに基づいて適切な戦略を生成する
 * 将来的な新しいフラグ追加に対応可能な拡張性を持つ
 */
export class PatternProcessingStrategyFactory {
  /**
   * 正規表現フラグに基づいて適切なパターン処理戦略を生成する
   * @param isRegex 正規表現フラグ（trueの場合正規表現、false/undefinedの場合文字列）
   * @param pattern パターン文字列
   * @returns 適切なパターン処理戦略インスタンス
   */
  public static createStrategy(isRegex?: boolean, pattern: string = ""): PatternProcessingStrategy {
    return isRegex 
      ? new RegexPatternProcessingStrategy(pattern)
      : new StringPatternProcessingStrategy(pattern);
  }
}
