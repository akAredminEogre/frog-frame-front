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
 * 注意: render()などのメソッドを呼ぶ前に必ずsetup()を呼び出すこと
 */
export class ToggleSwitchTestHelper {
  // Definite assignment assertion: setup()で初期化される
  // setup()を呼び忘れるとランタイムエラーになるため、beforeEach内で必ず呼び出すこと
  private container!: HTMLDivElement;
  private root!: ReactDOM.Root;

  /**
   * テスト前のセットアップ
   * beforeEach 内で必ず呼び出すこと
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
   * @param props ToggleSwitchProps。onChangeを省略した場合はvi.fn()がデフォルト値として使用される
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
   * React Ariaのuswitchはtype="checkbox"とrole="switch"を設定する
   */
  getInputElement(): HTMLInputElement | null {
    return this.container.querySelector('input') as HTMLInputElement | null;
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
