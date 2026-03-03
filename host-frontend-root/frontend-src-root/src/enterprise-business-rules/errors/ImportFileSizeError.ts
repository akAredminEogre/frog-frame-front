import { MAX_IMPORT_FILE_SIZE_MB } from '../value-objects/ImportFileSize';

/**
 * インポートファイルサイズ超過エラー
 * エラーメッセージをEBR層で保有する設計により、
 * Interactor は詳細なメッセージ内容を知らずに済む。
 * エラーメッセージの詳細はこのクラスが責務として持つ。
 */
export class ImportFileSizeError extends Error {
  constructor(fileSizeBytes: number) {
    super(
      `ファイルサイズが上限（${MAX_IMPORT_FILE_SIZE_MB}MB）を超えています (${fileSizeBytes} bytes)`
    );
    this.name = 'ImportFileSizeError';
  }
}
