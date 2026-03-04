/**
 * ConfirmImportInteractor.confirmImport - 正常系テスト
 * 1. validatedRulesで全件置換され、presentが呼ばれる
 * 2. 複数ルールで全件置換され、件数が正しく伝わる
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/ConfirmImportInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfirmImportInputData } from 'src/application-business-rules/dto/input/ConfirmImportInputData';
import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { ConfirmImportInteractor } from 'src/application-business-rules/interactors/ConfirmImportInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IConfirmImportPresenter } from 'src/application-business-rules/ports/output/IConfirmImportPresenter';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('ConfirmImportInteractor.confirmImport - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockPresenter: IConfirmImportPresenter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockPresenter = createMockPresenter();
    (mockRepository.replaceAll as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('validatedRulesで全件置換され、presentが呼ばれる', async () => {
    const existingRule = new RewriteRule(10, 'existing', '', '', false, true);
    (mockRepository.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(
      new RewriteRules({ '10': existingRule })
    );

    const validatedRules = [new RewriteRule(1, 'foo', '', '', false, true)];
    const interactor = new ConfirmImportInteractor(mockRepository, mockPresenter);

    await interactor.confirmImport(new ConfirmImportInputData(validatedRules));

    expect(mockRepository.replaceAll).toHaveBeenCalledTimes(1);
    expect(mockRepository.replaceAll).toHaveBeenCalledWith(validatedRules);

    expect(mockPresenter.present).toHaveBeenCalledTimes(1);
    expect(mockPresenter.present).toHaveBeenCalledWith(expect.any(ImportRulesJsonOutputData));
    const outputData = (mockPresenter.present as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ImportRulesJsonOutputData;
    expect(outputData.importedCount).toBe(1);
    expect(outputData.previousCount).toBe(1);
    expect(mockPresenter.presentError).not.toHaveBeenCalled();
  });

  it('複数ルールで全件置換され、件数が正しく伝わる', async () => {
    const existing1 = new RewriteRule(1, 'a', '', '', false, true);
    const existing2 = new RewriteRule(2, 'b', '', '', false, true);
    (mockRepository.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(
      new RewriteRules({ '1': existing1, '2': existing2 })
    );

    const validatedRules = [new RewriteRule(10, 'x', '', '', false, true), new RewriteRule(11, 'y', '', '', false, true), new RewriteRule(12, 'z', '', '', false, true)];
    const interactor = new ConfirmImportInteractor(mockRepository, mockPresenter);

    await interactor.confirmImport(new ConfirmImportInputData(validatedRules));

    expect(mockRepository.replaceAll).toHaveBeenCalledTimes(1);
    const outputData = (mockPresenter.present as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ImportRulesJsonOutputData;
    expect(outputData.importedCount).toBe(3);
    expect(outputData.previousCount).toBe(2);
    expect(mockPresenter.presentError).not.toHaveBeenCalled();
  });
});
