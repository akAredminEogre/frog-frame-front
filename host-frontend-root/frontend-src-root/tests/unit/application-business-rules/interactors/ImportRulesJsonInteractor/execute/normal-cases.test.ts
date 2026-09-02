/**
 * ImportRulesJsonInteractor.importRulesJson - 正常系テスト
 * 1. 妥当なJSONを受け取ると、解析→スキーマ検証→全件置換→present() を実行する
 * 2. 置換対象を repository.replaceAll() に構築済み RewriteRule[] として渡す
 * 3. 正常時は present() のみ呼び、presentError() は呼ばない（排他）
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockJsonParser } from 'tests/unit/application-business-rules/interactors/ImportRulesJsonInteractor/mocks/createMockJsonParser';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/ImportRulesJsonInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImportRulesJsonInputData } from 'src/application-business-rules/dto/input/ImportRulesJsonInputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import {
  IImportRulesJsonPresenter,
  ImportRulesJsonInteractor,
} from 'src/application-business-rules/interactors/ImportRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';

describe('ImportRulesJsonInteractor.importRulesJson - 正常系', () => {
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

  it('妥当なJSONを受け取ると解析→検証→replaceAll→present() を実行する', async () => {
    const parsed = {
      version: '1.0',
      rules: [
        {
          id: 1,
          oldString: 'old1',
          newString: 'new1',
          urlPattern: 'https://example.com',
          isRegex: false,
          isActive: true,
        },
        {
          id: 2,
          oldString: 'old2',
          newString: 'new2',
          urlPattern: 'https://example.org',
          isRegex: true,
          isActive: false,
        },
      ],
    };
    vi.mocked(mockJsonParser.parseAsObject).mockReturnValue(parsed);
    vi.mocked(mockRepository.replaceAll).mockResolvedValue(undefined);

    const interactor = new ImportRulesJsonInteractor(
      mockRepository,
      mockPresenter,
      mockJsonParser
    );
    const inputData = new ImportRulesJsonInputData(100, JSON.stringify(parsed));

    await interactor.importRulesJson(inputData);

    // 既読テキストが parser に渡る（再読取なし）
    expect(mockJsonParser.parseAsObject).toHaveBeenCalledTimes(1);
    expect(mockJsonParser.parseAsObject).toHaveBeenCalledWith(inputData.fileText);

    // 構築済み RewriteRule[] を replaceAll に渡す
    expect(mockRepository.replaceAll).toHaveBeenCalledTimes(1);
    const passedRules = vi.mocked(mockRepository.replaceAll).mock.calls[0][0];
    expect(passedRules).toHaveLength(2);
    expect(passedRules[0].id).toBe(1);
    expect(passedRules[0].oldString).toBe('old1');
    expect(passedRules[1].id).toBe(2);
    expect(passedRules[1].isActive).toBe(false);

    // present() のみ・件数を通知
    expect(mockPresenter.present).toHaveBeenCalledTimes(1);
    expect(mockPresenter.present).toHaveBeenCalledWith(expect.any(ImportRulesJsonOutputData));
    const outputData = vi.mocked(mockPresenter.present).mock.calls[0][0];
    expect(outputData.importedCount).toBe(2);
    expect(mockPresenter.presentError).not.toHaveBeenCalled();
  });

  it('id 省略ルールも受理し replaceAll→present() を実行する', async () => {
    const parsed = {
      version: '1.0',
      rules: [
        {
          oldString: 'a',
          newString: 'b',
          urlPattern: 'https://example.com',
          isRegex: false,
        },
      ],
    };
    vi.mocked(mockJsonParser.parseAsObject).mockReturnValue(parsed);
    vi.mocked(mockRepository.replaceAll).mockResolvedValue(undefined);

    const interactor = new ImportRulesJsonInteractor(
      mockRepository,
      mockPresenter,
      mockJsonParser
    );
    const inputData = new ImportRulesJsonInputData(50, JSON.stringify(parsed));

    await interactor.importRulesJson(inputData);

    expect(mockRepository.replaceAll).toHaveBeenCalledTimes(1);
    expect(mockPresenter.present).toHaveBeenCalledTimes(1);
    const outputData = vi.mocked(mockPresenter.present).mock.calls[0][0];
    expect(outputData.importedCount).toBe(1);
    expect(mockPresenter.presentError).not.toHaveBeenCalled();
  });
});
