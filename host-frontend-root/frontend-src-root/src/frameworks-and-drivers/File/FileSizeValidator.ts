import { IFileSizeValidator } from 'src/application-business-rules/ports/services/IFileSizeValidator';

/**
 * File.size APIのframeworks-and-drivers層ラッパー
 * CA準拠: File.sizeによるサイズ検証をこの層に閉じ込め、上位層の依存を排除する
 */
export class FileSizeValidator implements IFileSizeValidator {
  readonly maxSizeBytes = 5 * 1024 * 1024; // 5MB

  isExceedingMaxSize(file: File): boolean {
    return file.size > this.maxSizeBytes;
  }
}
