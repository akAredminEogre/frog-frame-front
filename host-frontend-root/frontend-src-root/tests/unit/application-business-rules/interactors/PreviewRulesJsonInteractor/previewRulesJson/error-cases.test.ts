/**
 * PreviewRulesJsonInteractor.previewRulesJson - 異常系テスト
 * 1. JSONパースエラーでpresentErrorが呼ばれる
 * 2. ルール0件でpresentErrorが呼ばれる
 * 3. oldStringが空でpresentErrorが呼ばれる
 * 4. サポート外バージョンでpresentErrorが呼ばれる
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/PreviewRulesJsonInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PreviewRulesJsonInputData } from 'src/application-business-rules/dto/input/PreviewRulesJsonInputData';
import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { MAX_RULE_COUNT } from 'src/application-business-rules/errors/ImportRulesJsonErrors';
import { PreviewRulesJsonInteractor } from 'src/application-business-rules/interactors/PreviewRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IPreviewRulesJsonPresenter } from 'src/application-business-rules/ports/output/IPreviewRulesJsonPresenter';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

const createMockFileTextReader = (): IFileTextReader => ({
  readAsText: vi.fn(),
});

const createMockJsonParser = (): IJsonParser => ({
  parse: vi.fn(),
  parseAsObject: vi.fn(),
});

describe('PreviewRulesJsonInteractor.previewRulesJson - 異常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockPresenter: IPreviewRulesJsonPresenter;
  let mockFileTextReader: IFileTextReader;
  let mockJsonParser: IJsonParser;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockPresenter = createMockPresenter();
    mockFileTextReader = createMockFileTextReader();
    mockJsonParser = createMockJsonParser();
    (mockRepository.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(new RewriteRules({}));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const makeFile = (): File => new File([''], 'rules.json', { type: 'application/json' });

  it('JSONパースエラーでpresentErrorが呼ばれる（parseエラー種別）', async () => {
    const file = makeFile();
    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue('invalid json');
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new SyntaxError('Unexpected token');
    });

    const interactor = new PreviewRulesJsonInteractor(
      mockRepository,
      mockPresenter,
      mockJsonParser,
      mockFileTextReader
    );

    await interactor.previewRulesJson(new PreviewRulesJsonInputData(file));

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    expect(mockPresenter.presentError).toHaveBeenCalledWith(
      expect.any(ImportRulesJsonErrorOutputData)
    );
    const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('parse');
    expect(mockPresenter.presentPreview).not.toHaveBeenCalled();
  });

  it('ルール0件でpresentErrorが呼ばれる（validationエラー種別）', async () => {
    const file = makeFile();
    const jsonData = { version: '1', rules: [] };
    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue(JSON.stringify(jsonData));
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockReturnValue(jsonData);

    const interactor = new PreviewRulesJsonInteractor(
      mockRepository,
      mockPresenter,
      mockJsonParser,
      mockFileTextReader
    );

    await interactor.previewRulesJson(new PreviewRulesJsonInputData(file));

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('validation');
    expect(mockPresenter.presentPreview).not.toHaveBeenCalled();
  });

  it('oldStringが空のルールでpresentErrorが呼ばれる（validationエラー種別）', async () => {
    const file = makeFile();
    const jsonData = {
      version: '1',
      rules: [{ id: 1, oldString: '', newString: 'bar', urlPattern: '', isRegex: false, isActive: true }],
    };
    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue(JSON.stringify(jsonData));
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockReturnValue(jsonData);

    const interactor = new PreviewRulesJsonInteractor(
      mockRepository,
      mockPresenter,
      mockJsonParser,
      mockFileTextReader
    );

    await interactor.previewRulesJson(new PreviewRulesJsonInputData(file));

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('validation');
    expect(mockPresenter.presentPreview).not.toHaveBeenCalled();
  });

  it('サポート外バージョンでpresentErrorが呼ばれる（validationエラー種別）', async () => {
    const file = makeFile();
    const jsonData = {
      version: '99',
      rules: [{ id: 1, oldString: 'foo', newString: 'bar', urlPattern: '', isRegex: false, isActive: true }],
    };
    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue(JSON.stringify(jsonData));
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockReturnValue(jsonData);

    const interactor = new PreviewRulesJsonInteractor(
      mockRepository,
      mockPresenter,
      mockJsonParser,
      mockFileTextReader
    );

    await interactor.previewRulesJson(new PreviewRulesJsonInputData(file));

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('validation');
    expect(mockPresenter.presentPreview).not.toHaveBeenCalled();
  });

  it('ルール件数がMAX_RULE_COUNTを超えた場合、presentErrorが呼ばれる（validationエラー種別）', async () => {
    const file = makeFile();
    const rules = [];
    for (let ruleNum = 1; ruleNum <= MAX_RULE_COUNT + 1; ruleNum++) {
      rules.push({ id: ruleNum, oldString: `foo${ruleNum}`, newString: 'bar', urlPattern: '', isRegex: false, isActive: true });
    }
    const jsonData = { version: '1', rules };
    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue(JSON.stringify(jsonData));
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockReturnValue(jsonData);

    const interactor = new PreviewRulesJsonInteractor(
      mockRepository,
      mockPresenter,
      mockJsonParser,
      mockFileTextReader
    );

    await interactor.previewRulesJson(new PreviewRulesJsonInputData(file));

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('validation');
    expect(mockPresenter.presentPreview).not.toHaveBeenCalled();
  });
});
