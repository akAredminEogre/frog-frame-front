/**
 * ToggleSwitch コンポーネント - レンダリングテスト
 * 1. checked=false: data-selected=falseでレンダリング
 * 2. checked=true: data-selected=trueでレンダリング
 * 3. disabled=true: data-disabled=trueでレンダリング
 * 4. disabled未指定: data-disabled=falseでレンダリング
 */
import { ToggleSwitchTestHelper } from 'tests/unit/frameworks-and-drivers/ui/components/atoms/ToggleSwitch/test-helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ToggleSwitch - レンダリング', () => {
  const helper = new ToggleSwitchTestHelper();

  beforeEach(() => {
    helper.setup();
  });

  afterEach(() => {
    helper.cleanup();
  });

  describe('checked状態のレンダリング', () => {
    it('checked=falseの場合、data-selected=falseでレンダリングされる', async () => {
      // Arrange & Act
      await helper.render({ checked: false, ariaLabel: 'ルールの有効化' });

      // Assert
      const toggle = helper.getToggleElement();
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('data-selected')).toBe('false');
    });

    it('checked=trueの場合、data-selected=trueでレンダリングされる', async () => {
      // Arrange & Act
      await helper.render({ checked: true, ariaLabel: 'ルールの有効化' });

      // Assert
      const toggle = helper.getToggleElement();
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('data-selected')).toBe('true');
    });
  });

  describe('disabled状態のレンダリング', () => {
    it('disabled=trueの場合、data-disabled=trueでレンダリングされる', async () => {
      // Arrange & Act
      await helper.render({ checked: false, disabled: true, ariaLabel: 'ルールの有効化' });

      // Assert
      const toggle = helper.getToggleElement();
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('data-disabled')).toBe('true');
    });

    it('disabled未指定の場合、data-disabled=falseでレンダリングされる', async () => {
      // Arrange & Act
      await helper.render({ checked: false, ariaLabel: 'ルールの有効化' });

      // Assert
      const toggle = helper.getToggleElement();
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('data-disabled')).toBe('false');
    });
  });
});
