/**
 * ToastNotification コンポーネント テストヘルパー
 * 4つのテストファイル間で共通のセットアップ・ヘルパー関数を提供
 */
import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { flushPromises } from 'tests/unit/frameworks-and-drivers/ui/test-utils';
import { vi } from 'vitest';

import { ToastNotification } from 'src/frameworks-and-drivers/ui/components/atoms/ToastNotification/ToastNotification';

type ToastNotificationProps = React.ComponentProps<typeof ToastNotification>;

// 後方互換性のため再エクスポート
export { flushPromises };

/**
 * テスト用コンテナとReactルートを管理するクラス
 * 注意: render()などのメソッドを呼ぶ前に必ずsetup()を呼び出すこと
 */
export class ToastNotificationTestHelper {
  private container: HTMLDivElement | null = null;
  private root: ReactDOM.Root | null = null;

  /**
   * setup()が呼ばれているか確認し、未呼び出しの場合はエラーをスロー
   */
  private ensureSetup(): void {
    if (!this.container || !this.root) {
      throw new Error(
        '他のメソッドを使用する前に ToastNotificationTestHelper.setup() を呼び出す必要があります。beforeEach() 内で helper.setup() を呼び出してください。',
      );
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
   * act()でラップしてReact 18の非同期レンダリングを適切に処理
   * @param props ToastNotificationProps
   */
  async render(props: ToastNotificationProps): Promise<void> {
    this.ensureSetup();
    await act(async () => {
      this.root!.render(<ToastNotification {...props} />);
      await flushPromises();
    });
  }

  /**
   * アラート要素（トーストコンテナ）を取得
   */
  getAlertElement(): HTMLElement | null {
    this.ensureSetup();
    return this.container!.querySelector('[role="alert"]');
  }

  /**
   * 閉じるボタンを取得
   */
  getCloseButton(): HTMLButtonElement | null {
    this.ensureSetup();
    return this.container!.querySelector(
      'button[aria-label="閉じる"]',
    ) as HTMLButtonElement | null;
  }

  /**
   * メッセージテキストを取得
   */
  getMessageText(): string | null {
    this.ensureSetup();
    const span = this.container!.querySelector('span');
    return span?.textContent ?? null;
  }

  /**
   * コンテナを取得
   */
  getContainer(): HTMLDivElement {
    this.ensureSetup();
    return this.container!;
  }
}
