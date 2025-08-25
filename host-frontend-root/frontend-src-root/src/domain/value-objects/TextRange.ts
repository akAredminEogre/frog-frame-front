/**
 * テキスト内の範囲を表すドメインエンティティ
 * DOM Range型との混同を避けるため、明示的に名前を付ける
 */
export class TextRange {
  constructor(
    public readonly start: number,
    public readonly end: number,
  ) {
    if (start < 0) {
      throw new Error('開始位置は0以上である必要があります');
    }
    if (end < start) {
      throw new Error('終了位置は開始位置以上である必要があります');
    }
  }
}
