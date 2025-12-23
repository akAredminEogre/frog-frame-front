/**
 * ToggleSwitch コンポーネント テストヘルパー
 * 3つのテストファイル間で共通のセットアップ・ヘルパー関数を提供
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { vi } from 'vitest';

import { ToggleSwitch, ToggleSwitchProps } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';

/**
 * テスト用コンテナとReactルートを管理するクラス
 */
export class ToggleSwitchTestHelper {
  private container: HTMLDivElement;
  private root: ReactDOM.Root;

  constructor() {
    this.container = document.createElement('div');
    this.root = null as unknown as ReactDOM.Root;
  }

  /**
   * テスト前のセットアップ
   * beforeEach 内で呼び出す
   */
  setup(): void {
    vi.clearAllMocks();
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.root = ReactDOM.createRoot(this.container);
  }

  /**
   * テスト後のクリーンアップ
   * afterEach 内で呼び出す
   */
  cleanup(): void {
    this.root.unmount();
    this.container.remove();
    vi.resetAllMocks();
  }

  /**
   * コンポーネントをレンダリング
   * @param props ToggleSwitchProps（onChangeはオプショナル）
   */
  async render(props: Omit<ToggleSwitchProps, 'onChange'> & { onChange?: (checked: boolean) => void }): Promise<void> {
    const defaultProps: ToggleSwitchProps = {
      onChange: vi.fn(),
      ...props,
    };
    this.root.render(<ToggleSwitch {...defaultProps} />);
    // Flush React updates
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }

  /**
   * data-selected属性を持つトグル要素を取得
   */
  getToggleElement(): Element | null {
    return this.container.querySelector('[data-selected]');
  }

  /**
   * input要素を取得
   */
  getInputElement(): HTMLInputElement | null {
    return this.container.querySelector('input') as HTMLInputElement | null;
  }

  /**
   * checkbox input要素を取得
   */
  getCheckboxElement(): HTMLInputElement | null {
    return this.container.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
  }

  /**
   * コンテナを取得
   */
  getContainer(): HTMLDivElement {
    return this.container;
  }
}

/**
 * React更新をフラッシュするためのユーティリティ
 */
export const flushPromises = (): Promise<void> => {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
};
