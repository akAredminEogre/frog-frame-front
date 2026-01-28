/**
 * useDeleteRule カスタムフック テストヘルパー
 *
 * ReactDOM.createRootを使用してフックをラッパーコンポーネント経由でレンダリングし、
 * フックの状態値とメソッドをrefを通じてテストから操作可能にする。
 *
 * 注意: render()などのメソッドを呼ぶ前に必ずsetup()を呼び出すこと
 */
import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { flushPromises } from 'tests/unit/frameworks-and-drivers/ui/test-utils';
import { vi } from 'vitest';

import { useDeleteRule, UseDeleteRuleResult } from 'src/frameworks-and-drivers/ui/hooks/useDeleteRule';

// 後方互換性のため再エクスポート
export { flushPromises };

/**
 * フックの状態・メソッドへの参照を保持する型
 */
interface HookRef {
  current: UseDeleteRuleResult | null;
}

/**
 * useDeleteRuleフックをテストするためのラッパーコンポーネント
 * フックの戻り値をhookRefに格納し、テスト側からアクセス可能にする
 */
const UseDeleteRuleWrapper: React.FC<{
  onDeleteSuccess: (ruleId: number) => void;
  hookRef: HookRef;
}> = ({ onDeleteSuccess, hookRef }) => {
  const result = useDeleteRule(onDeleteSuccess);
  hookRef.current = result;
  return null;
};

/**
 * useDeleteRuleフックのテストヘルパークラス
 *
 * setup() → render() → 各操作メソッド/ゲッター → cleanup() の順で使用する。
 */
export class UseDeleteRuleTestHelper {
  private container: HTMLDivElement | null = null;
  private root: ReactDOM.Root | null = null;
  private hookRef: HookRef = { current: null };
  private onDeleteSuccess: ReturnType<typeof vi.fn> = vi.fn();

  /**
   * setup()が呼ばれているか確認し、未呼び出しの場合はエラーをスロー
   */
  private ensureSetup(): void {
    if (!this.container || !this.root) {
      throw new Error(
        '他のメソッドを使用する前に UseDeleteRuleTestHelper.setup() を呼び出す必要があります。beforeEach() 内で helper.setup() を呼び出してください。'
      );
    }
  }

  /**
   * フックがレンダリング済みか確認し、未レンダリングの場合はエラーをスロー
   */
  private ensureRendered(): UseDeleteRuleResult {
    if (!this.hookRef.current) {
      throw new Error(
        'フックがまだレンダリングされていません。render() を呼び出してください。'
      );
    }
    return this.hookRef.current;
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
    this.hookRef = { current: null };
    this.onDeleteSuccess = vi.fn();
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
    this.hookRef = { current: null };
    vi.resetAllMocks();
  }

  /**
   * フックをレンダリングする
   * act()でラップしてReact 18の非同期レンダリングを適切に処理
   *
   * @param onDeleteSuccess - カスタムのonDeleteSuccessコールバック（省略時はvi.fn()）
   */
  async render(onDeleteSuccess?: (ruleId: number) => void): Promise<void> {
    this.ensureSetup();
    if (onDeleteSuccess) {
      this.onDeleteSuccess = onDeleteSuccess as ReturnType<typeof vi.fn>;
    }
    await act(async () => {
      this.root!.render(
        React.createElement(UseDeleteRuleWrapper, {
          onDeleteSuccess: this.onDeleteSuccess,
          hookRef: this.hookRef,
        })
      );
      await flushPromises();
    });
  }

  /**
   * onDeleteSuccessモック関数を取得
   */
  getOnDeleteSuccess(): ReturnType<typeof vi.fn> {
    return this.onDeleteSuccess;
  }

  // --- 状態ゲッター ---

  /**
   * deletingIdsを取得
   */
  getDeletingIds(): Set<number> {
    return this.ensureRendered().deletingIds;
  }

  /**
   * deleteTargetIdを取得
   */
  getDeleteTargetId(): number | null {
    return this.ensureRendered().deleteTargetId;
  }

  /**
   * deleteErrorを取得
   */
  getDeleteError(): { ruleId: number; message: string } | null {
    return this.ensureRendered().deleteError;
  }

  // --- アクションメソッド ---

  /**
   * handleDeleteを呼び出す
   * @param ruleId 削除対象のルールID
   */
  async callHandleDelete(ruleId: number): Promise<void> {
    const result = this.ensureRendered();
    await act(async () => {
      result.handleDelete(ruleId);
      await flushPromises();
    });
  }

  /**
   * confirmDeleteを呼び出す
   */
  async callConfirmDelete(): Promise<void> {
    const result = this.ensureRendered();
    await act(async () => {
      await result.confirmDelete();
      await flushPromises();
    });
  }

  /**
   * confirmDeleteを開始するが、deleteRuleの完了を待たない
   * deleteRuleが未解決のPromiseを返す場合にdeletingIdsへのID追加を確認するために使用
   */
  async startConfirmDeleteWithoutAwaiting(): Promise<void> {
    const result = this.ensureRendered();
    await act(async () => {
      void result.confirmDelete();
      await flushPromises();
    });
  }

  /**
   * cancelDeleteを呼び出す
   */
  async callCancelDelete(): Promise<void> {
    const result = this.ensureRendered();
    await act(async () => {
      result.cancelDelete();
      await flushPromises();
    });
  }

  /**
   * dismissDeleteErrorを呼び出す
   */
  async callDismissDeleteError(): Promise<void> {
    const result = this.ensureRendered();
    await act(async () => {
      result.dismissDeleteError();
      await flushPromises();
    });
  }
}
