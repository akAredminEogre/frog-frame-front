export const MAX_IMPORT_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

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
}
