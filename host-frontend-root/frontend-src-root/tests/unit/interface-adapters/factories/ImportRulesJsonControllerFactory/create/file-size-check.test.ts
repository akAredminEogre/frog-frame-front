/**
 * ImportRulesJsonControllerFactory - ファイルサイズ検査順序テスト
 * 1. 上限超過ファイル（>5MB）: readAsText 未呼出・onError でサイズエラーを受け取る
 * 2. 正常サイズファイル（≤5MB）: readAsText が呼ばれ・インポートが進む
 */
import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { MAX_IMPORT_FILE_SIZE_BYTES } from 'src/enterprise-business-rules/value-objects/ImportFileSize';
import { ImportRulesJsonControllerFactory } from 'src/interface-adapters/factories/ImportRulesJsonControllerFactory';

describe('ImportRulesJsonControllerFactory - ファイルサイズ検査順序', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockJsonParser: IJsonParser;
  let mockFileTextReader: IFileTextReader;
  let onSuccess: ReturnType<typeof vi.fn>;
  let onError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRewriteRuleRepository();
    mockJsonParser = { parse: vi.fn(), parseAsObject: vi.fn() };
    mockFileTextReader = { readAsText: vi.fn() };
    onSuccess = vi.fn();
    onError = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('上限超過ファイル（>5MB）はファイル読取前にリジェクトされ readAsText は呼ばれない', async () => {
    const oversizedFile = new File(['x'], 'large.json', { type: 'application/json' });
    Object.defineProperty(oversizedFile, 'size', {
      value: MAX_IMPORT_FILE_SIZE_BYTES + 1,
      configurable: true,
    });

    const factory = new ImportRulesJsonControllerFactory(
      mockRepository,
      mockJsonParser,
      mockFileTextReader
    );
    const controller = factory.create(onSuccess, onError);

    await controller.importRulesJson(oversizedFile);

    expect(mockFileTextReader.readAsText).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.stringContaining('5MB'));
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('正常サイズファイル（≤5MB）はファイルが読み取られてインポートが進む', async () => {
    const validJson = JSON.stringify({
      version: '1.0',
      rules: [
        {
          oldString: 'foo',
          newString: 'bar',
          urlPattern: 'https://example.com',
          isRegex: false,
          isActive: true,
        },
      ],
    });
    const normalFile = new File([validJson], 'rules.json', { type: 'application/json' });
    Object.defineProperty(normalFile, 'size', {
      value: MAX_IMPORT_FILE_SIZE_BYTES,
      configurable: true,
    });

    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue(validJson);
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockReturnValue(
      JSON.parse(validJson)
    );
    (mockRepository.replaceAll as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    const factory = new ImportRulesJsonControllerFactory(
      mockRepository,
      mockJsonParser,
      mockFileTextReader
    );
    const controller = factory.create(onSuccess, onError);

    await controller.importRulesJson(normalFile);

    expect(mockFileTextReader.readAsText).toHaveBeenCalledTimes(1);
    expect(mockFileTextReader.readAsText).toHaveBeenCalledWith(normalFile);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });
});
