/**
 * ToggleSwitch コンポーネント テストヘルパー
 * 3つのテストファイル間で共通のセットアップ・ヘルパー関数を提供
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { vi } from 'vitest';

import { ToggleSwitch } from 'src/frameworks-and-drivers/ui/components/atoms/ToggleSwitch';

type ToggleSwitchProps = React.ComponentProps<typeof ToggleSwitch>;

/**
 * React更新をフラッシュするためのユーティリティ
 */
export const flushPromises = (): Promise<void> => {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
};

/**
 * テスト用コンテナとReactルートを管理するクラス
 * 注意: render()などのメソッドを呼ぶ前に必ずsetup()を呼び出すこと
 */
export class ToggleSwitchTestHelper {
  private container: HTMLDivElement | null = null;
  private root: ReactDOM.Root | null = null;

  /**
   * setup()が呼ばれているか確認し、未呼び出しの場合はエラーをスロー
   */
  private ensureSetup(): void {
    if (!this.container || !this.root) {
      throw new Error('他のメソッドを使用する前に ToggleSwitchTestHelper.setup() を呼び出す必要があります。beforeEach() 内で helper.setup() を呼び出してください。');
    }
  }

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
   * setup()が呼ばれていない場合は何もせず早期リターン（カスケード障害を防ぐ）
   */
  cleanup(): void {
    if (!this.container || !this.root) {
      return;
    }
    this.root.unmount();
    this.container.remove();
    this.container = null;
    this.root = null;
    vi.resetAllMocks();
  }

  /**
   * コンポーネントをレンダリング
   * @param props ToggleSwitchProps。onChangeを省略した場合はvi.fn()がデフォルト値として使用される
   */
  async render(props: Omit<ToggleSwitchProps, 'onChange'> & { onChange?: (checked: boolean) => void }): Promise<void> {
    this.ensureSetup();
    const defaultProps: ToggleSwitchProps = {
      onChange: vi.fn(),
      ...props,
    };
    this.root!.render(<ToggleSwitch {...defaultProps} />);
    await flushPromises();
  }

  /**
   * data-selected属性を持つトグル要素を取得
   */
  getToggleElement(): Element | null {
    this.ensureSetup();
    return this.container!.querySelector('[data-selected]');
  }

  /**
   * input要素を取得
   * React AriaのuseSwitchはtype="checkbox"とrole="switch"を設定する
   */
  getInputElement(): HTMLInputElement | null {
    this.ensureSetup();
    return this.container!.querySelector('input') as HTMLInputElement | null;
  }

  /**
   * コンテナを取得
   */
  getContainer(): HTMLDivElement {
    this.ensureSetup();
    return this.container!;
  }
}
