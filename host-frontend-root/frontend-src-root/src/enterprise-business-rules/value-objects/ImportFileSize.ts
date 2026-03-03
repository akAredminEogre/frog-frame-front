import { ImportFileSizeError } from '../errors/ImportFileSizeError';

export const MAX_IMPORT_FILE_SIZE_MB = 5;
export const MAX_IMPORT_FILE_SIZE_BYTES = MAX_IMPORT_FILE_SIZE_MB * 1024 * 1024;

/**
 * インポートファイルサイズのValue Object
 * ファイルサイズ上限はドメインルール（ビジネスルール）であるため
 * enterprise-business-rules層に配置する
 */
export class ImportFileSize {
  constructor(private readonly byteSize: number) {}

  isExceedingLimit(): boolean {
    return this.byteSize > MAX_IMPORT_FILE_SIZE_BYTES;
  }

  /**
   * ファイルサイズがエラーメッセージを持つ例外を発生させるバリデーション
   * @throws ImportFileSizeError ファイルサイズが上限を超えている場合
   */
  validateOrThrow(): void {
    if (this.isExceedingLimit()) {
      throw new ImportFileSizeError(this.byteSize);
    }
  }

}
