import { describe, expect, it } from 'vitest';

import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';
import { GetElementSelectionUseCase } from 'src/application/usecases/selection/GetElementSelectionUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';
import { contentContainer } from 'src/infrastructure/di/contentContainer';
import { GetSelectionService } from 'src/infrastructure/windows/getSelectionService';

/**
 * Content Script用DIコンテナの具体クラス登録確認テスト (Awilix)
 * contentContainer.resolve()で具体クラスを解決できることを検証する
 */
describe('Content DI Container - 具体クラス登録確認テスト (Awilix)', () => {
  /**
   * 具体クラス解決テストケース
   * 各クラスがcontentContainer.resolve()で正しく解決できることを検証する
   */
  const testCases = [
    {
      description: 'ApplyRulesOnDomMutationUseCaseを解決できること',
      input: { classToken: ApplyRulesOnDomMutationUseCase },
      expected: { className: 'ApplyRulesOnDomMutationUseCase' }
    },
    {
      description: 'GetElementSelectionUseCaseを解決できること',
      input: { classToken: GetElementSelectionUseCase },
      expected: { className: 'GetElementSelectionUseCase' }
    },
    {
      description: 'ChromeRuntimeRewriteRuleRepositoryを解決できること',
      input: { classToken: ChromeRuntimeRewriteRuleRepository },
      expected: { className: 'ChromeRuntimeRewriteRuleRepository' }
    },
    {
      description: 'WindowCurrentUrlServiceを解決できること',
      input: { classToken: WindowCurrentUrlService },
      expected: { className: 'WindowCurrentUrlService' }
    },
    {
      description: 'DebounceTimerを解決できること',
      input: { classToken: DebounceTimer },
      expected: { className: 'DebounceTimer' }
    },
    {
      description: 'GetSelectionServiceを解決できること',
      input: { classToken: GetSelectionService },
      expected: { className: 'GetSelectionService' }
    }
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const { classToken } = testCase.input;
      const { className } = testCase.expected;

      // Act
      const resolved = contentContainer.resolve<InstanceType<typeof classToken>>(classToken);

      // Assert
      expect(resolved).toBeDefined();
      expect(resolved).not.toBeNull();
      expect(resolved).toBeInstanceOf(classToken);
      expect((resolved as any).constructor.name).toBe(className);
    });
  });
});
