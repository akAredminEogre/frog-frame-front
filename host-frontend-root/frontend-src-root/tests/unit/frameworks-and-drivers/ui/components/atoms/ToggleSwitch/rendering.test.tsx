/**
 * ToggleSwitch コンポーネント - レンダリングテスト
 * 1. checked=false: data-selected=falseでレンダリング
 * 2. checked=true: data-selected=trueでレンダリング
 * 3. disabled=true: data-disabled=trueでレンダリング
 * 4. disabled未指定: data-disabled=falseでレンダリング
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToggleSwitch } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';

describe('ToggleSwitch - レンダリング', () => {
  let container: HTMLDivElement;
  let root: ReactDOM.Root;

  beforeEach(() => {
    vi.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    container.remove();
    vi.resetAllMocks();
  });

  const renderComponent = (props: {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    ariaLabel: string;
  }) => {
    const defaultProps = {
      onChange: vi.fn(),
      ...props,
    };
    root.render(<ToggleSwitch {...defaultProps} />);
    // Flush React updates
    return new Promise<void>((resolve) => setTimeout(resolve, 0));
  };

  const getToggleElement = () => {
    // data-selected属性を持つ要素を検索（CSSモジュールのクラス名はハッシュ化されるため属性で検索）
    return container.querySelector('[data-selected]');
  };

  describe('checked状態のレンダリング', () => {
    it('checked=falseの場合、data-selected=falseでレンダリングされる', async () => {
      // Arrange & Act
      await renderComponent({ checked: false, ariaLabel: 'ルールの有効化' });

      // Assert
      const toggle = getToggleElement();
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('data-selected')).toBe('false');
    });

    it('checked=trueの場合、data-selected=trueでレンダリングされる', async () => {
      // Arrange & Act
      await renderComponent({ checked: true, ariaLabel: 'ルールの有効化' });

      // Assert
      const toggle = getToggleElement();
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('data-selected')).toBe('true');
    });
  });

  describe('disabled状態のレンダリング', () => {
    it('disabled=trueの場合、data-disabled=trueでレンダリングされる', async () => {
      // Arrange & Act
      await renderComponent({ checked: false, disabled: true, ariaLabel: 'ルールの有効化' });

      // Assert
      const toggle = getToggleElement();
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('data-disabled')).toBe('true');
    });

    it('disabled未指定の場合、data-disabled=falseでレンダリングされる', async () => {
      // Arrange & Act
      await renderComponent({ checked: false, ariaLabel: 'ルールの有効化' });

      // Assert
      const toggle = getToggleElement();
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('data-disabled')).toBe('false');
    });
  });
});
