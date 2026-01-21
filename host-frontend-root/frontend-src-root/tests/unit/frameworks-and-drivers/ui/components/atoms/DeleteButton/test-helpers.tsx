/**
 * DeleteButton コンポーネント テストヘルパー
 * 3つのテストファイル間で共通のセットアップ・ヘルパー関数を提供
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { flushPromises } from 'tests/unit/frameworks-and-drivers/ui/test-utils';
import { vi } from 'vitest';

import { DeleteButton } from 'src/frameworks-and-drivers/ui/components/atoms/DeleteButton/DeleteButton';

type DeleteButtonProps = React.ComponentProps<typeof DeleteButton>;

// 後方互換性のため再エクスポート
export { flushPromises };

/**
 * テスト用コンテナとReactルートを管理するクラス
 * 注意: render()などのメソッドを呼ぶ前に必ずsetup()を呼び出すこと
 */
export class DeleteButtonTestHelper {
  private container: HTMLDivElement | null = null;
  private root: ReactDOM.Root | null = null;

  /**
   * setup()が呼ばれているか確認し、未呼び出しの場合はエラーをスロー
   */
  private ensureSetup(): void {
    if (!this.container || !this.root) {
      throw new Error('他のメソッドを使用する前に DeleteButtonTestHelper.setup() を呼び出す必要があります。beforeEach() 内で helper.setup() を呼び出してください。');
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
   * setup()が呼ばれていない場合は何もせず早期リターン（他のテストケースへの影響を防ぐため）
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
   * @param props DeleteButtonProps。onClickを省略した場合はvi.fn()がデフォルト値として使用される
   */
  async render(props?: Partial<DeleteButtonProps>): Promise<void> {
    this.ensureSetup();
    const defaultProps: DeleteButtonProps = {
      onClick: vi.fn(),
      ...props,
    };
    this.root!.render(<DeleteButton {...defaultProps} />);
    await flushPromises();
  }

  /**
   * ボタン要素を取得
   */
  getButtonElement(): HTMLButtonElement | null {
    this.ensureSetup();
    return this.container!.querySelector('button') as HTMLButtonElement | null;
  }

  /**
   * SVGアイコン要素を取得
   */
  getSvgElement(): SVGElement | null {
    this.ensureSetup();
    return this.container!.querySelector('svg') as SVGElement | null;
  }

  /**
   * コンテナを取得
   */
  getContainer(): HTMLDivElement {
    this.ensureSetup();
    return this.container!;
  }
}
