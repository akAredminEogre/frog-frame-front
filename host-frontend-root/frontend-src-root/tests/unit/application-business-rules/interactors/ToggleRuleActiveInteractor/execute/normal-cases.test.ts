/**
 * ToggleRuleActiveInteractor.execute - 正常系テスト
 * 1. isActive=true のルールを false に切り替え
 * 2. isActive=false のルールを true に切り替え
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/mocks/createMockPresenter';
import { createMockTabsGateway } from 'tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/mocks/createMockTabsGateway';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';
import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveOutputData';
import { ToggleRuleActiveInteractor } from 'src/application-business-rules/interactors/ToggleRuleActiveInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/IToggleRuleActivePresenter';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('ToggleRuleActiveInteractor.execute - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockTabsGateway: ITabsGateway;
  let mockPresenter: IToggleRuleActivePresenter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockTabsGateway = createMockTabsGateway();
    mockPresenter = createMockPresenter();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'isActive=true のルールを false に切り替え',
      input: { ruleId: 1 },
      initialIsActive: true,
      expectedIsActive: false,
    },
    {
      description: 'isActive=false のルールを true に切り替え',
      input: { ruleId: 2 },
      initialIsActive: false,
      expectedIsActive: true,
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      const originalRule = new RewriteRule(
        testCase.input.ruleId,
        'oldString',
        'newString',
        'https://example.com',
        false,
        testCase.initialIsActive
      );
      (mockRepository.getById as ReturnType<typeof vi.fn>).mockResolvedValue(originalRule);

      const interactor = new ToggleRuleActiveInteractor(
        mockRepository,
        mockTabsGateway,
        mockPresenter
      );
      const inputData = new ToggleRuleActiveInputData(testCase.input.ruleId);

      await interactor.execute(inputData);

      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
      expect(mockRepository.getById).toHaveBeenCalledWith(testCase.input.ruleId);

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      const updatedRule = (mockRepository.update as ReturnType<typeof vi.fn>).mock.calls[0][0] as RewriteRule;
      expect(updatedRule.id).toBe(testCase.input.ruleId);
      expect(updatedRule.isActive).toBe(testCase.expectedIsActive);

      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(1);
      const reloadedRule = (mockTabsGateway.reloadMatchingTabs as ReturnType<typeof vi.fn>).mock.calls[0][0] as RewriteRule;
      expect(reloadedRule.id).toBe(testCase.input.ruleId);
      expect(reloadedRule.isActive).toBe(testCase.expectedIsActive);

      expect(mockPresenter.present).toHaveBeenCalledTimes(1);
      expect(mockPresenter.present).toHaveBeenCalledWith(expect.any(ToggleRuleActiveOutputData));
      const outputData = (mockPresenter.present as ReturnType<typeof vi.fn>).mock.calls[0][0] as ToggleRuleActiveOutputData;
      expect(outputData.toggledRule.id).toBe(testCase.input.ruleId);
      expect(outputData.toggledRule.isActive).toBe(testCase.expectedIsActive);
    });
  });
});
