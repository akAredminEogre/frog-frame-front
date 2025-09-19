export class RewriteRule {
  constructor(
    public readonly id: string,
    public readonly oldString: string,
    public readonly newString: string,
    public readonly urlPattern?: string,
    public readonly isRegex?: boolean
  ) {}

  /**
   * パターンを改行コードを無視するように変換する統合メソッド
   * 正規表現ルールと通常ルールの両方に対応し、改行コードやスペースを無視する変換を行う
   * @returns 改行コードを無視する正規表現パターン文字列
   * 使用するメンバ変数: oldString, isRegex
   */
  public createRedundantPattern(): string {
    const pattern = this.oldString;
    const isRegexFlag = this.isRegex ?? false;
    
    let processedPattern: string;
    
    if (isRegexFlag) {
      // 正規表現の場合はそのまま使用
      processedPattern = pattern;
    } else {
      // 通常文字列の場合は特殊文字をエスケープ
      processedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // `<` → `(?:\\s*)<`、`>` → `>(?:\\s*)` の変換でHTML要素間の改行コードを無視
    // 非キャプチャグループ(?:\\s*)を使用してユーザーのキャプチャグループ番号がずれないよう実装
    return processedPattern
      .replace(/</g, '(?:\\s*)<')
      .replace(/>/g, '>(?:\\s*)');
  }
}
