/**
 * ConfirmImportInteractor.confirmImport - 異常系テスト
 * 1. repository.getAllが失敗した場合、presentErrorが呼ばれる
 * 2. repository.replaceAllが失敗した場合、presentErrorが呼ばれる
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/ConfirmImportInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { ConfirmImportInteractor } from 'src/application-business-rules/interactors/ConfirmImportInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IConfirmImportPresenter } from 'src/application-business-rules/ports/output/IConfirmImportPresenter';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('ConfirmImportInteractor.confirmImport - 異常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockPresenter: IConfirmImportPresenter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockPresenter = createMockPresenter();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('repository.getAllが失敗した場合、presentErrorが呼ばれる（storageエラー種別）', async () => {
    (mockRepository.getAll as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('ストレージ読み取りエラー')
    );

    const validatedRules = [new RewriteRule(1, 'foo', '', '', false, true)];
    const interactor = new ConfirmImportInteractor(mockRepository, mockPresenter);
    interactor.setPendingRules(validatedRules);

    await interactor.confirmImport();

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    expect(mockPresenter.presentError).toHaveBeenCalledWith(
      expect.any(ImportRulesJsonErrorOutputData)
    );
    const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('storage');
    expect(mockRepository.replaceAll).not.toHaveBeenCalled();
    expect(mockPresenter.present).not.toHaveBeenCalled();
  });

  it('repository.replaceAllが失敗した場合、presentErrorが呼ばれる（storageエラー種別）', async () => {
    (mockRepository.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(new RewriteRules({}));
    (mockRepository.replaceAll as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('ストレージ書き込みエラー')
    );

    const validatedRules = [new RewriteRule(1, 'foo', '', '', false, true), new RewriteRule(2, 'bar', '', '', false, true)];
    const interactor = new ConfirmImportInteractor(mockRepository, mockPresenter);
    interactor.setPendingRules(validatedRules);

    await interactor.confirmImport();

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ImportRulesJsonErrorOutputData;
    expect(errorData.errorType).toBe('storage');
    expect(mockPresenter.present).not.toHaveBeenCalled();
  });
});
