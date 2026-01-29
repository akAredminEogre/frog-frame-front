/**
 * DeleteRuleUI コンポーネント テストヘルパー
 * テストファイル間で共通のセットアップ・ヘルパー関数を提供
 */
import { SSRProvider } from '@react-aria/ssr';
import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { flushPromises } from 'tests/unit/frameworks-and-drivers/ui/test-utils';
import { vi } from 'vitest';

import {
  DeleteRuleUI,
  DeleteRuleUIProps,
} from 'src/frameworks-and-drivers/ui/components/organisms/DeleteRuleUI/DeleteRuleUI';

// 後方互換性のため再エクスポート
export { flushPromises };

/**
 * デフォルトのProps値を作成
 */
export const createDefaultProps = (
  overrides: Partial<DeleteRuleUIProps> = {},
): DeleteRuleUIProps => ({
  deleteTargetId: null,
  deleteError: null,
  onConfirmDelete: vi.fn(),
  onCancelDelete: vi.fn(),
  onDismissError: vi.fn(),
  ...overrides,
});

/**
 * テスト用コンテナとReactルートを管理するクラス
 * 注意: render()などのメソッドを呼ぶ前に必ずsetup()を呼び出すこと
 */
export class DeleteRuleUITestHelper {
  private container: HTMLDivElement | null = null;
  private root: ReactDOM.Root | null = null;

  /**
   * setup()が呼ばれているか確認し、未呼び出しの場合はエラーをスロー
   */
  private ensureSetup(): void {
    if (!this.container || !this.root) {
      throw new Error(
        '他のメソッドを使用する前に DeleteRuleUITestHelper.setup() を呼び出す必要があります。beforeEach() 内で helper.setup() を呼び出してください。',
      );
    }
  }

  /**
   * テスト前のセットアップ
   * beforeEach 内で必ず呼び出すこと
   * 注意: モック初期化（vi.clearAllMocks()）はテストファイル側で明示的に呼び出すこと
   */
  setup(): void {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.root = ReactDOM.createRoot(this.container);
  }

  /**
   * テスト後のクリーンアップ
   * afterEach 内で呼び出す
   * setup()が呼ばれていない場合は何もせず早期リターン（他のテストケースへの影響を防ぐため）
   * 注意: モックリセット（vi.resetAllMocks()）はテストファイル側で明示的に呼び出すこと
   */
  cleanup(): void {
    if (!this.container || !this.root) {
      return;
    }
    this.root.unmount();
    this.container.remove();
    this.container = null;
    this.root = null;
    // ダイアログがポータルでdocument.bodyにレンダリングされるため、
    // 残っている要素をクリーンアップ
    const portalElements = document.querySelectorAll('[data-testid="confirm-dialog-overlay"]');
    portalElements.forEach((el) => el.remove());
    // 背景スクロールをリセット
    document.body.style.overflow = '';
  }

  /**
   * コンポーネントをレンダリング
   * React AriaのSSRProviderでラップしてテスト環境での動作を保証
   * act()でラップしてReact 18の非同期レンダリングを適切に処理
   * @param props DeleteRuleUIProps（部分指定可能、未指定分はデフォルト値を使用）
   */
  async render(props: Partial<DeleteRuleUIProps> = {}): Promise<void> {
    this.ensureSetup();
    const fullProps = createDefaultProps(props);
    // flushPromisesをact内に入れて更新を確実に同期
    // （act外で非同期更新が完了するとReact警告が発生する可能性があるため）
    await act(async () => {
      this.root!.render(
        <SSRProvider>
          <DeleteRuleUI {...fullProps} />
        </SSRProvider>,
      );
      await flushPromises();
    });
  }

  /**
   * ConfirmDialogのダイアログ要素を取得（document.bodyから検索、ポータルのため）
   */
  getConfirmDialog(): Element | null {
    return document.querySelector('[data-testid="confirm-dialog"]');
  }

  /**
   * ToastNotificationのアラート要素を取得
   */
  getToastNotification(): HTMLElement | null {
    this.ensureSetup();
    return this.container!.querySelector('[role="alert"]');
  }

  /**
   * 確認ボタンを取得（ConfirmDialog内）
   */
  getConfirmButton(): HTMLButtonElement | null {
    return document.querySelector(
      '[data-testid="confirm-dialog-confirm-button"]',
    ) as HTMLButtonElement | null;
  }

  /**
   * キャンセルボタンを取得（ConfirmDialog内）
   */
  getCancelButton(): HTMLButtonElement | null {
    return document.querySelector(
      '[data-testid="confirm-dialog-cancel-button"]',
    ) as HTMLButtonElement | null;
  }

  /**
   * Toast通知の閉じるボタンを取得
   */
  getToastCloseButton(): HTMLButtonElement | null {
    this.ensureSetup();
    return this.container!.querySelector(
      'button[aria-label="閉じる"]',
    ) as HTMLButtonElement | null;
  }

  /**
   * コンテナを取得
   */
  getContainer(): HTMLDivElement {
    this.ensureSetup();
    return this.container!;
  }
}
