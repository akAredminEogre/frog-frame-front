import { describe, expect, it } from 'vitest';

import {
  ImportFileSizeError,
  InvalidImportFileSizeError,
} from 'src/enterprise-business-rules/errors/ImportFileSizeError';
import {
  ImportFileSize,
  MAX_IMPORT_FILE_SIZE_BYTES,
} from 'src/enterprise-business-rules/value-objects/ImportFileSize';

/**
 * ImportFileSize Value Object のバリデーション
 * - 正常系: 非負の有限数（0・上限内）
 * - 上限超過: ImportFileSizeError
 * - 不正値（負数・NaN・Infinity）: InvalidImportFileSizeError
 */
describe('ImportFileSize - 正常系', () => {
  it('0 バイトを許容する（空状態の境界値）', () => {
    expect(() => new ImportFileSize(0)).not.toThrow();
  });

  it('上限値ちょうどを許容する', () => {
    expect(() => new ImportFileSize(MAX_IMPORT_FILE_SIZE_BYTES)).not.toThrow();
  });
});

describe('ImportFileSize - 上限超過', () => {
  it('上限を 1 バイト超えると ImportFileSizeError をthrowする', () => {
    expect(() => new ImportFileSize(MAX_IMPORT_FILE_SIZE_BYTES + 1)).toThrow(
      ImportFileSizeError
    );
  });
});

describe('ImportFileSize - 不正値バリデーション', () => {
  const invalidCases: { description: string; value: number }[] = [
    { description: '負数', value: -1 },
    { description: 'NaN', value: NaN },
    { description: 'Infinity', value: Infinity },
    { description: '-Infinity', value: -Infinity },
  ];

  invalidCases.forEach(({ description, value }) => {
    it(`${description} の場合は InvalidImportFileSizeError をthrowする`, () => {
      expect(() => new ImportFileSize(value)).toThrow(InvalidImportFileSizeError);
    });
  });
});
