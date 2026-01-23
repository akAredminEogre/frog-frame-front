/**
 * RuleTableRow コンポーネント テストヘルパー
 * 複数のテストファイル間で共通のセットアップ・ヘルパー関数を提供
 */
import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { flushPromises } from 'tests/unit/frameworks-and-drivers/ui/test-utils';
import { vi } from 'vitest';

import RuleTableRow from 'src/components/molecules/RuleTableRow/RuleTableRow';

type RuleTableRowProps = React.ComponentProps<typeof RuleTableRow>;

// テストファイルで使用するユーティリティを再エクスポート
export { act } from 'react';
export { flushPromises };

/**
 * テスト用コンテナとReactルートを管理するクラス
 * 注意: render()などのメソッドを呼ぶ前に必ずsetup()を呼び出すこと
 */
export class RuleTableRowTestHelper {
  private container: HTMLDivElement | null = null;
  private root: ReactDOM.Root | null = null;

  /**
   * setup()が呼ばれているか確認し、未呼び出しの場合はエラーをスロー
   */
  private ensureSetup(): void {
    if (!this.container || !this.root) {
      throw new Error(
        '他のメソッドを使用する前に RuleTableRowTestHelper.setup() を呼び出す必要があります。beforeEach() 内で helper.setup() を呼び出してください。'
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
   * setup()が呼ばれていない場合は何もせず早期リターン
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
   * RuleTableRowはtrの子要素なので、tableでラップしてレンダリング
   * @param props RuleTableRowProps
   */
  async render(props: RuleTableRowProps): Promise<void> {
    this.ensureSetup();
    await act(async () => {
      this.root!.render(
        <table>
          <tbody>
            <RuleTableRow {...props} />
          </tbody>
        </table>
      );
      await flushPromises();
    });
  }

  /**
   * DeleteButtonのボタン要素を取得
   * aria-labelで識別
   */
  getDeleteButton(): HTMLButtonElement | null {
    this.ensureSetup();
    return this.container!.querySelector(
      'button[aria-label="ルールを削除"]'
    ) as HTMLButtonElement | null;
  }

  /**
   * 編集ボタンを取得
   * data-testidで識別
   */
  getEditButton(): HTMLButtonElement | null {
    this.ensureSetup();
    return this.container!.querySelector(
      'button[data-testid="edit-button"]'
    ) as HTMLButtonElement | null;
  }

  /**
   * トグルスイッチを取得
   */
  getToggleSwitch(): HTMLInputElement | null {
    this.ensureSetup();
    return this.container!.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement | null;
  }

  /**
   * コンテナを取得
   */
  getContainer(): HTMLDivElement {
    this.ensureSetup();
    return this.container!;
  }
}
