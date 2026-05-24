import { ImportFileSizeError } from 'src/enterprise-business-rules/errors/ImportFileSizeError';

export const MAX_IMPORT_FILE_SIZE_MB = 5;
export const MAX_IMPORT_FILE_SIZE_BYTES = MAX_IMPORT_FILE_SIZE_MB * 1024 * 1024;

/**
 * インポートファイルサイズのValue Object
 * ファイルサイズ上限はドメインルール（ビジネスルール）であるため
 * enterprise-business-rules層に配置する
 */
export class ImportFileSize {
  constructor(private readonly byteSize: number) {
    if (this.isExceedingLimit()) {
      throw new ImportFileSizeError(this.byteSize);
    }
  }

  isExceedingLimit(): boolean {
    return this.byteSize > MAX_IMPORT_FILE_SIZE_BYTES;
  }

}
