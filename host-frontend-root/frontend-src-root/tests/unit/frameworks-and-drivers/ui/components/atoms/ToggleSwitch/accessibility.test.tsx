/**
 * ToggleSwitch コンポーネント - アクセシビリティテスト
 * 1. aria-label: ariaLabel propが設定される
 * 2. role: switch roleが設定される
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToggleSwitch } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';

describe('ToggleSwitch - アクセシビリティ', () => {
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

  const getInputElement = () => {
    return container.querySelector('input') as HTMLInputElement | null;
  };

  it('ariaLabel propがaria-labelとして設定される', async () => {
    // Arrange & Act
    const ariaLabelText = 'ルールの有効化テスト';
    await renderComponent({ checked: false, ariaLabel: ariaLabelText });

    // Assert
    const input = getInputElement();
    expect(input).not.toBeNull();
    expect(input?.getAttribute('aria-label')).toBe(ariaLabelText);
  });

  it('switch roleが設定される', async () => {
    // Arrange & Act
    await renderComponent({ checked: false, ariaLabel: 'ルールの有効化' });

    // Assert
    const input = getInputElement();
    expect(input).not.toBeNull();
    expect(input?.getAttribute('role')).toBe('switch');
  });
});
