import { MAX_IMPORT_FILE_SIZE_MB } from 'src/enterprise-business-rules/value-objects/ImportFileSize';

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

/**
 * 不正なインポートファイルサイズエラー
 * 負数・NaN・Infinity 等、ファイルサイズとして成立しない値を拒否する。
 * 「上限超過」とは区別されるドメイン値の不正状態を表す。
 */
export class InvalidImportFileSizeError extends Error {
  constructor(fileSizeBytes: number) {
    super(`ファイルサイズが不正です (${fileSizeBytes})`);
    this.name = 'InvalidImportFileSizeError';
  }
}
