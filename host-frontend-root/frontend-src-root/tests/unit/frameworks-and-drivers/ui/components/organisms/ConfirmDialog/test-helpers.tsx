/**
 * ConfirmDialog コンポーネント テストヘルパー
 * テストファイル間で共通のセットアップ・ヘルパー関数を提供
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { vi } from 'vitest';

import { SSRProvider } from '@react-aria/ssr';

import { ConfirmDialog, ConfirmDialogProps } from 'src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/ConfirmDialog';

/**
 * React更新をフラッシュするためのユーティリティ
 */
export const flushPromises = (): Promise<void> => {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
};

/**
 * デフォルトのProps値を作成
 */
export const createDefaultProps = (
  overrides: Partial<ConfirmDialogProps> = {}
): ConfirmDialogProps => ({
  isOpen: true,
  title: 'テストタイトル',
  message: 'テストメッセージ',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
  ...overrides,
});

/**
 * テスト用コンテナとReactルートを管理するクラス
 * 注意: render()などのメソッドを呼ぶ前に必ずsetup()を呼び出すこと
 */
export class ConfirmDialogTestHelper {
  private container: HTMLDivElement | null = null;
  private root: ReactDOM.Root | null = null;

  /**
   * setup()が呼ばれているか確認し、未呼び出しの場合はエラーをスロー
   */
  private ensureSetup(): void {
    if (!this.container || !this.root) {
      throw new Error(
        'ConfirmDialogTestHelper.setup() must be called before using other methods. Add helper.setup() to beforeEach().'
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
    // ダイアログがポータルでdocument.bodyにレンダリングされるため、
    // 残っている要素をクリーンアップ
    const portalElements = document.querySelectorAll('[data-testid="confirm-dialog-overlay"]');
    portalElements.forEach((el) => el.remove());
    // 背景スクロールをリセット
    document.body.style.overflow = '';
    vi.resetAllMocks();
  }

  /**
   * コンポーネントをレンダリング
   * React AriaのSSRProviderでラップしてテスト環境での動作を保証
   * @param props ConfirmDialogProps
   */
  async render(props: Partial<ConfirmDialogProps> = {}): Promise<void> {
    this.ensureSetup();
    const fullProps = createDefaultProps(props);
    this.root!.render(
      <SSRProvider>
        <ConfirmDialog {...fullProps} />
      </SSRProvider>
    );
    await flushPromises();
  }

  /**
   * ダイアログ要素を取得（document.bodyから検索、ポータルのため）
   */
  getDialogElement(): Element | null {
    return document.querySelector('[data-testid="confirm-dialog"]');
  }

  /**
   * オーバーレイ要素を取得
   */
  getOverlayElement(): Element | null {
    return document.querySelector('[data-testid="confirm-dialog-overlay"]');
  }

  /**
   * 確認ボタンを取得
   */
  getConfirmButton(): HTMLButtonElement | null {
    return document.querySelector('[data-testid="confirm-dialog-confirm-button"]');
  }

  /**
   * キャンセルボタンを取得
   */
  getCancelButton(): HTMLButtonElement | null {
    return document.querySelector('[data-testid="confirm-dialog-cancel-button"]');
  }

  /**
   * タイトル要素を取得（ダイアログ内のh2要素）
   * useId()により動的なIDが生成されるため、タグで検索
   */
  getTitleElement(): HTMLHeadingElement | null {
    const dialog = this.getDialogElement();
    return dialog?.querySelector('h2') ?? null;
  }

  /**
   * メッセージ要素を取得（ダイアログ内のp要素）
   * useId()により動的なIDが生成されるため、タグで検索
   */
  getMessageElement(): HTMLParagraphElement | null {
    const dialog = this.getDialogElement();
    return dialog?.querySelector('p') ?? null;
  }

  /**
   * コンテナを取得
   */
  getContainer(): HTMLDivElement {
    this.ensureSetup();
    return this.container!;
  }
}
