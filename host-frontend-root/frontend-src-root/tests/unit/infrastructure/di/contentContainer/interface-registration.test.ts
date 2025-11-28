import 'src/infrastructure/di/contentContainer';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { contentContainer } from 'src/infrastructure/di/contentContainer';

/**
 * Content Script用DIコンテナのインターフェース登録確認テスト
 * contentContainer.tsに登録されているインターフェースを検証する
 */
describe('Content Container - インターフェース登録確認テスト', () => {
  beforeEach(() => {
    contentContainer.clearInstances();
  });

  afterEach(() => {
    contentContainer.clearInstances();
  });

  const expectedRegistrations = [
    {
      interface: 'IRewriteRuleRepository',
      implementationName: 'ChromeRuntimeRewriteRuleRepository'
    }
  ];

  /**
   * @testcases
   * | interface               | implementationName                   |
   * |-------------------------|--------------------------------------|
   * | IRewriteRuleRepository  | ChromeRuntimeRewriteRuleRepository   |
   */
  it.each(expectedRegistrations)(
    'should resolve $interface to $implementationName',
    ({ interface: expectedInterface, implementationName }) => {
      // Act
      const resolved = contentContainer.resolve(expectedInterface) as any;

      // Assert
      expect(resolved).toBeDefined();
      expect(resolved).not.toBeNull();
      expect(typeof resolved).toBe('object');
      expect(resolved.constructor.name).toBe(implementationName);
    }
  );

  it('should have IRewriteRuleRepository registered', () => {
    // Act
    const isRegistered = (contentContainer as any).isRegistered('IRewriteRuleRepository');

    // Assert
    expect(isRegistered).toBe(true);
  });
});
