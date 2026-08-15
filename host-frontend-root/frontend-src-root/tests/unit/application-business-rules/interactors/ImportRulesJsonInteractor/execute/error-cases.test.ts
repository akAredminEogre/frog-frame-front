/**
 * ImportRulesJsonInteractor.importRulesJson - 異常系テスト
 * どの段で例外が throw されても presentError() へ集約し、present()/replaceAll() は呼ばない（排他）ことを検証する。
 * 1. ファイルサイズ超過（EBR ImportFileSize）→ presentError(validation)
 * 2. JSON構文エラー（jsonParser.parseAsObject が JsonSyntaxError を throw）→ presentError(parse)
 * 3. スキーマ不正（version/rules 欠落）→ presentError(validation)
 * 4. replaceAll 失敗（永続化エラー）→ presentError(storage)
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockJsonParser } from 'tests/unit/application-business-rules/interactors/ImportRulesJsonInteractor/mocks/createMockJsonParser';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/ImportRulesJsonInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { JsonSyntaxError } from 'src/application-business-rules/errors/JsonParserErrors';
import {
  IImportRulesJsonPresenter,
  ImportRulesJsonInteractor,
} from 'src/application-business-rules/interactors/ImportRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { MAX_IMPORT_FILE_SIZE_BYTES } from 'src/enterprise-business-rules/value-objects/ImportFileSize';

const validParsed = {
  version: '1.0',
  rules: [
    { id: 1, oldString: 'a', newString: 'b', urlPattern: 'https://example.com', isRegex: false },
  ],
};

describe('ImportRulesJsonInteractor.importRulesJson - 異常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockPresenter: IImportRulesJsonPresenter;
  let mockJsonParser: IJsonParser;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockPresenter = createMockPresenter();
    mockJsonParser = createMockJsonParser();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const createInteractor = (): ImportRulesJsonInteractor =>
    new ImportRulesJsonInteractor(mockRepository, mockPresenter, mockJsonParser);

  it('ファイルサイズ超過時は presentError(validation) を呼び present()/replaceAll() は呼ばない', async () => {
    const interactor = createInteractor();
    const inputData = new ImportRulesJsonInputData(MAX_IMPORT_FILE_SIZE_BYTES + 1, '{}');

    await interactor.importRulesJson(inputData);

    expect(mockJsonParser.parseAsObject).not.toHaveBeenCalled();
    expect(mockRepository.replaceAll).not.toHaveBeenCalled();
    expect(mockPresenter.present).not.toHaveBeenCalled();
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    const errorData = vi.mocked(mockPresenter.presentError).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('validation');
  });

  it('JSON構文エラー時は presentError(parse) を呼び present()/replaceAll() は呼ばない', async () => {
    vi.mocked(mockJsonParser.parseAsObject).mockImplementation(() => {
      throw new JsonSyntaxError();
    });

    const interactor = createInteractor();
    const inputData = new ImportRulesJsonInputData(100, 'not-json');

    await interactor.importRulesJson(inputData);

    expect(mockRepository.replaceAll).not.toHaveBeenCalled();
    expect(mockPresenter.present).not.toHaveBeenCalled();
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    const errorData = vi.mocked(mockPresenter.presentError).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('parse');
  });

  it('スキーマ不正（version/rules 欠落）時は presentError(validation) を呼び replaceAll() は呼ばない', async () => {
    vi.mocked(mockJsonParser.parseAsObject).mockReturnValue({ foo: 'bar' });

    const interactor = createInteractor();
    const inputData = new ImportRulesJsonInputData(100, '{"foo":"bar"}');

    await interactor.importRulesJson(inputData);

    expect(mockRepository.replaceAll).not.toHaveBeenCalled();
    expect(mockPresenter.present).not.toHaveBeenCalled();
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    const errorData = vi.mocked(mockPresenter.presentError).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('validation');
  });

  it('replaceAll 失敗時は presentError(storage) を呼び present() は呼ばない', async () => {
    vi.mocked(mockJsonParser.parseAsObject).mockReturnValue(validParsed);
    vi.mocked(mockRepository.replaceAll).mockRejectedValue(new Error('DB書き込みに失敗しました'));

    const interactor = createInteractor();
    const inputData = new ImportRulesJsonInputData(100, JSON.stringify(validParsed));

    await interactor.importRulesJson(inputData);

    expect(mockRepository.replaceAll).toHaveBeenCalledTimes(1);
    expect(mockPresenter.present).not.toHaveBeenCalled();
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    const errorData = vi.mocked(mockPresenter.presentError).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('storage');
  });
});
