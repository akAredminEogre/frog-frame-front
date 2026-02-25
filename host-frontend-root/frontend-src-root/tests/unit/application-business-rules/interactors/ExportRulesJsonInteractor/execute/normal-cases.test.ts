/**
 * ExportRulesJsonInteractor.execute - 正常系テスト
 * 1. ルールが複数ある場合、全ルールのJSONをpresent()で通知する
 * 2. ルールが0件の場合、空のrulesを持つJSONをpresent()で通知する
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/ExportRulesJsonInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExportRulesJsonInputData } from 'src/application-business-rules/dto/input/ExportRulesJsonInputData';
import { ExportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonOutputData';
import { ExportRulesJsonInteractor } from 'src/application-business-rules/interactors/ExportRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IExportRulesJsonPresenter } from 'src/application-business-rules/ports/output/IExportRulesJsonPresenter';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('ExportRulesJsonInteractor.execute - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockPresenter: IExportRulesJsonPresenter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockPresenter = createMockPresenter();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('ルールが複数ある場合、全ルールのJSONをpresent()で通知する', async () => {
    const rule1 = RewriteRule.fromParams(1, {
      oldString: 'old1',
      newString: 'new1',
      urlPattern: 'https://example.com',
      isRegex: false,
      isActive: true,
    });
    const rule2 = RewriteRule.fromParams(2, {
      oldString: 'old2',
      newString: 'new2',
      urlPattern: 'https://example.org',
      isRegex: true,
      isActive: false,
    });
    const mockRewriteRules = new RewriteRules({ '1': rule1, '2': rule2 });
    vi.mocked(mockRepository.getAll).mockResolvedValue(mockRewriteRules);

    const interactor = new ExportRulesJsonInteractor(mockRepository, mockPresenter);
    const inputData = new ExportRulesJsonInputData();

    await interactor.execute(inputData);

    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(mockRepository.getAll).toHaveBeenCalledWith();
    expect(mockPresenter.present).toHaveBeenCalledTimes(1);
    expect(mockPresenter.present).toHaveBeenCalledWith(expect.any(ExportRulesJsonOutputData));
    expect(mockPresenter.presentError).not.toHaveBeenCalled();

    const outputData = vi.mocked(mockPresenter.present).mock.calls[0][0];
    const parsedJson = JSON.parse(outputData.jsonContent);

    expect(parsedJson.version).toBe('1.0');
    expect(parsedJson.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    expect(parsedJson.rules).toHaveLength(2);
    expect(parsedJson.rules).toContainEqual({
      id: 1,
      oldString: 'old1',
      newString: 'new1',
      urlPattern: 'https://example.com',
      isRegex: false,
      isActive: true,
    });
    expect(parsedJson.rules).toContainEqual({
      id: 2,
      oldString: 'old2',
      newString: 'new2',
      urlPattern: 'https://example.org',
      isRegex: true,
      isActive: false,
    });
    expect(outputData.fileName).toMatch(/^frog-frame-front-rules-\d{8}_\d{6}\.json$/);
  });

  it('ルールが0件の場合、空のrulesを持つJSONをpresent()で通知する', async () => {
    const emptyRewriteRules = new RewriteRules({});
    vi.mocked(mockRepository.getAll).mockResolvedValue(emptyRewriteRules);

    const interactor = new ExportRulesJsonInteractor(mockRepository, mockPresenter);
    const inputData = new ExportRulesJsonInputData();

    await interactor.execute(inputData);

    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(mockRepository.getAll).toHaveBeenCalledWith();
    expect(mockPresenter.present).toHaveBeenCalledTimes(1);
    expect(mockPresenter.present).toHaveBeenCalledWith(expect.any(ExportRulesJsonOutputData));
    expect(mockPresenter.presentError).not.toHaveBeenCalled();

    const outputData = vi.mocked(mockPresenter.present).mock.calls[0][0];
    const parsedJson = JSON.parse(outputData.jsonContent);

    expect(parsedJson.version).toBe('1.0');
    expect(parsedJson.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    expect(parsedJson.rules).toHaveLength(0);
    expect(outputData.fileName).toMatch(/^frog-frame-front-rules-\d{8}_\d{6}\.json$/);
  });
});
