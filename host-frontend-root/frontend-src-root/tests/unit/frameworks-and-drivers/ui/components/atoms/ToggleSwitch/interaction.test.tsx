/**
 * ToggleSwitch コンポーネント - インタラクションテスト
 * 1. クリック: onChangeが新しい状態で呼ばれる
 * 2. disabled時クリック: onChangeが呼ばれない
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToggleSwitch } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';

describe('ToggleSwitch - インタラクション', () => {
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
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    ariaLabel: string;
  }) => {
    root.render(<ToggleSwitch {...props} />);
    // Flush React updates
    return new Promise<void>((resolve) => setTimeout(resolve, 0));
  };

  const getInputElement = () => {
    return container.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
  };

  it('クリック時にonChangeが新しい状態で呼ばれる', async () => {
    // Arrange
    const mockOnChange = vi.fn();
    await renderComponent({ checked: false, onChange: mockOnChange, ariaLabel: 'ルールの有効化' });

    // Act
    const input = getInputElement();
    expect(input).not.toBeNull();
    input?.click();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    // Assert
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('disabled時はクリックしてもonChangeが呼ばれない', async () => {
    // Arrange
    const mockOnChange = vi.fn();
    await renderComponent({ checked: false, onChange: mockOnChange, disabled: true, ariaLabel: 'ルールの有効化' });

    // Act
    const input = getInputElement();
    expect(input).not.toBeNull();
    input?.click();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    // Assert
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
