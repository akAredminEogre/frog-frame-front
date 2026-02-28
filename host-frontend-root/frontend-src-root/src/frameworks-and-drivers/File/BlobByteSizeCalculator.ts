import { IByteSizeCalculator } from 'src/application-business-rules/ports/services/IByteSizeCalculator';

/**
 * Blob APIのframeworks-and-drivers層ラッパー
 * CA準拠: Blob APIによるバイトサイズ計算をこの層に閉じ込め、上位層の依存を排除する
 */
export class BlobByteSizeCalculator implements IByteSizeCalculator {
  calculateByteSize(text: string): number {
    return new Blob([text]).size;
  }
}
