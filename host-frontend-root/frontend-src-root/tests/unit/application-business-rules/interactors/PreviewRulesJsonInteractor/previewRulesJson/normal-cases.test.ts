/**
 * PreviewRulesJsonInteractor.previewRulesJson - 正常系テスト
 * 1. 有効なJSONファイルでプレビューデータが表示される
 * 2. 複数ルールを含むJSONでプレビューデータが表示される
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/PreviewRulesJsonInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PreviewRulesJsonInputData } from 'src/application-business-rules/dto/input/PreviewRulesJsonInputData';
import { PreviewRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/PreviewRulesJsonPreviewOutputData';
import { PreviewRulesJsonInteractor } from 'src/application-business-rules/interactors/PreviewRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IPreviewRulesJsonPresenter } from 'src/application-business-rules/ports/output/IPreviewRulesJsonPresenter';
import { IFileTextReader } from 'src/application-business-rules/ports/services/IFileTextReader';
import { IJsonParser } from 'src/application-business-rules/ports/services/IJsonParser';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

const createMockFileTextReader = (): IFileTextReader => ({
  readAsText: vi.fn(),
});

const createMockJsonParser = (): IJsonParser => ({
  parse: vi.fn(),
  parseAsObject: vi.fn(),
});

describe('PreviewRulesJsonInteractor.previewRulesJson - 正常系', () => {
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

    // デフォルト: 現在0件
    (mockRepository.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(new RewriteRules({}));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const makeFile = (): File =>
    new File([''], 'rules.json', { type: 'application/json' });

  it('有効なJSONファイルでプレビューデータが表示される', async () => {
    const jsonContent = JSON.stringify({
      version: '1.0',
      rules: [{ id: 1, oldString: 'foo', newString: 'bar', urlPattern: '', isRegex: false, isActive: true }],
    });
    const file = makeFile();
    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue(jsonContent);
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockReturnValue(
      JSON.parse(jsonContent)
    );

    const interactor = new PreviewRulesJsonInteractor(
      mockRepository,
      mockPresenter,
      mockJsonParser,
      mockFileTextReader
    );

    await interactor.previewRulesJson(new PreviewRulesJsonInputData(file));

    expect(mockPresenter.presentPreview).toHaveBeenCalledTimes(1);
    expect(mockPresenter.presentPreview).toHaveBeenCalledWith(
      expect.any(PreviewRulesJsonPreviewOutputData)
    );
    const outputData = (mockPresenter.presentPreview as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as PreviewRulesJsonPreviewOutputData;
    expect(outputData.currentRuleCount).toBe(0);
    expect(outputData.importRuleCount).toBe(1);
    expect(outputData.validatedRules).toHaveLength(1);
    expect(outputData.validatedRules[0].oldString).toBe('foo');

    expect(mockPresenter.presentError).not.toHaveBeenCalled();
  });

  it('複数ルールを含むJSONでプレビューデータが表示され現在件数も正しい', async () => {
    const existingRule = new RewriteRule(10, 'existing', '', '', false, true);
    (mockRepository.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(
      new RewriteRules({ '10': existingRule })
    );

    const rules = [
      { id: 1, oldString: 'a', newString: 'A', urlPattern: '', isRegex: false, isActive: true },
      { id: 2, oldString: 'b', newString: 'B', urlPattern: '', isRegex: true, isActive: false },
    ];
    const jsonContent = JSON.stringify({ version: '1.0', rules });
    const file = makeFile();
    (mockFileTextReader.readAsText as ReturnType<typeof vi.fn>).mockResolvedValue(jsonContent);
    (mockJsonParser.parseAsObject as ReturnType<typeof vi.fn>).mockReturnValue(
      JSON.parse(jsonContent)
    );

    const interactor = new PreviewRulesJsonInteractor(
      mockRepository,
      mockPresenter,
      mockJsonParser,
      mockFileTextReader
    );

    await interactor.previewRulesJson(new PreviewRulesJsonInputData(file));

    expect(mockPresenter.presentPreview).toHaveBeenCalledTimes(1);
    const outputData = (mockPresenter.presentPreview as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as PreviewRulesJsonPreviewOutputData;
    expect(outputData.currentRuleCount).toBe(1);
    expect(outputData.importRuleCount).toBe(2);
    expect(outputData.validatedRules).toHaveLength(2);
    expect(mockPresenter.presentError).not.toHaveBeenCalled();
  });
});
