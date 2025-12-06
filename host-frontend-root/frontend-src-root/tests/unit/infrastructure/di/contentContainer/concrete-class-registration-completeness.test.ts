import { describe, expect, it } from 'vitest';

import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';
import { GetElementSelectionUseCase } from 'src/application/usecases/selection/GetElementSelectionUseCase';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';
import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';
import { WindowCurrentUrlService } from 'src/infrastructure/browser/window/WindowCurrentUrlService';
import { contentContainer } from 'src/infrastructure/di/contentContainer';
import { DomRootChecker } from 'src/infrastructure/document/DomRootChecker';
import { ElementFactory } from 'src/infrastructure/document/ElementFactory';
import { GetSelectionService } from 'src/infrastructure/windows/getSelectionService';

/**
 * contentContainerの内部プロパティからclassToKeyMapを動的に取得する
 * tsyringeの_registry._registryMapと同様のアクセスパターン
 */
function getClassToKeyMap(): Map<Function, string> {
  return (contentContainer as any)._classToKeyMap;
}

/**
 * DIコンテナから登録済み具体クラストークンの一覧を取得する
 * contentContainer.tsのclassToKeyMapから動的に取得
 */
function getRegisteredConcreteClassTokens(): Array<{ token: Function; key: string }> {
  return Array.from(getClassToKeyMap().entries()).map(([token, key]) => ({ token, key }));
}

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
    },
    {
      description: 'DomRootCheckerを解決できること',
      input: { classToken: DomRootChecker },
      expected: { className: 'DomRootChecker' }
    },
    {
      description: 'ElementFactoryを解決できること',
      input: { classToken: ElementFactory },
      expected: { className: 'ElementFactory' }
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

  /**
   * DIコンテナに登録されている具体クラス数と、テストケースで期待する数が一致することを検証
   * これにより、DIコンテナに新しいクラスが追加された場合にテストケースの追加漏れを検出できる
   */
  it('DIコンテナ登録数とテストケース数が一致すること', () => {
    // Act - DIコンテナから登録済み具体クラストークンを動的取得
    const actualRegisteredTokens = getRegisteredConcreteClassTokens();

    // Assert - 期待される登録数と一致することを確認
    expect(actualRegisteredTokens).toHaveLength(testCases.length);

    // Assert - 各具体クラスがDIコンテナに登録されていることを確認
    const actualTokenSet = new Set(actualRegisteredTokens.map(({ token }) => token));
    testCases.forEach(({ input: { classToken } }) => {
      expect(actualTokenSet.has(classToken),
        `Test case exists for ${classToken.name} but it's not registered in classToKeyMap`
      ).toBe(true);
    });

    // Assert - DIコンテナに登録されている各クラスにテストケースが存在することを確認
    const testCaseTokenSet = new Set<Function>(testCases.map(tc => tc.input.classToken));
    actualRegisteredTokens.forEach(({ token }) => {
      expect(testCaseTokenSet.has(token),
        `Class ${(token as any).name} is registered in classToKeyMap but missing a test case`
      ).toBe(true);
    });
  });
});
