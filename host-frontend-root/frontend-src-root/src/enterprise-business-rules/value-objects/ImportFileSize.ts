import {
  ImportFileSizeError,
  InvalidImportFileSizeError,
} from 'src/enterprise-business-rules/errors/ImportFileSizeError';

export const MAX_IMPORT_FILE_SIZE_MB = 5;
export const MAX_IMPORT_FILE_SIZE_BYTES = MAX_IMPORT_FILE_SIZE_MB * 1024 * 1024;

/**
 * インポートファイルサイズのValue Object
 * ファイルサイズ上限はドメインルール（ビジネスルール）であるため
 * enterprise-business-rules層に配置する
 */
export class ImportFileSize {
  constructor(private readonly byteSize: number) {
    if (!this.isValidByteSize()) {
      throw new InvalidImportFileSizeError(this.byteSize);
    }
    if (this.isExceedingLimit()) {
      throw new ImportFileSizeError(this.byteSize);
    }
  }

  // ファイルサイズとして成立する値か（非負の有限数のみ許容）
  private isValidByteSize(): boolean {
    return Number.isFinite(this.byteSize) && this.byteSize >= 0;
  }

  isExceedingLimit(): boolean {
    return this.byteSize > MAX_IMPORT_FILE_SIZE_BYTES;
  }

}
