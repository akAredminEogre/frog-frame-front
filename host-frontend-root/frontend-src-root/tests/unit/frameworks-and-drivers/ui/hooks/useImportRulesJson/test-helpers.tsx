/**
 * useImportRulesJson カスタムフック テストヘルパー
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

import {
  useImportRulesJson,
  UseImportRulesJsonResult,
} from 'src/frameworks-and-drivers/ui/hooks/useImportRulesJson';

export { flushPromises };

interface HookRef {
  current: UseImportRulesJsonResult | null;
}

const UseImportRulesJsonWrapper: React.FC<{
  onRulesChanged: () => void;
  hookRef: HookRef;
}> = ({ onRulesChanged, hookRef }) => {
  const result = useImportRulesJson(onRulesChanged);
  hookRef.current = result;
  return null;
};

/**
 * useImportRulesJsonフックのテストヘルパークラス
 * setup() → render() → 各操作メソッド/ゲッター → cleanup() の順で使用する。
 */
export class UseImportRulesJsonTestHelper {
  private container: HTMLDivElement | null = null;
  private root: ReactDOM.Root | null = null;
  private hookRef: HookRef = { current: null };
  private onRulesChanged: ReturnType<typeof vi.fn> = vi.fn();

  private ensureSetup(): void {
    if (!this.container || !this.root) {
      throw new Error(
        '他のメソッドを使用する前に UseImportRulesJsonTestHelper.setup() を呼び出す必要があります。beforeEach() 内で helper.setup() を呼び出してください。'
      );
    }
  }

  private ensureRendered(): UseImportRulesJsonResult {
    if (!this.hookRef.current) {
      throw new Error('フックがまだレンダリングされていません。render() を呼び出してください。');
    }
    return this.hookRef.current;
  }

  setup(): void {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.root = ReactDOM.createRoot(this.container);
    this.hookRef = { current: null };
    this.onRulesChanged = vi.fn();
  }

  cleanup(): void {
    if (!this.container || !this.root) {
      return;
    }
    this.root.unmount();
    this.container.remove();
    this.container = null;
    this.root = null;
    this.hookRef = { current: null };
  }

  async render(onRulesChanged?: () => void): Promise<void> {
    this.ensureSetup();
    if (onRulesChanged) {
      this.onRulesChanged = vi.fn(onRulesChanged);
    }
    await act(async () => {
      this.root!.render(
        React.createElement(UseImportRulesJsonWrapper, {
          onRulesChanged: this.onRulesChanged,
          hookRef: this.hookRef,
        })
      );
      await flushPromises();
    });
  }

  getOnRulesChanged(): ReturnType<typeof vi.fn> {
    return this.onRulesChanged;
  }

  getHookResult(): UseImportRulesJsonResult {
    return this.ensureRendered();
  }

  getIsImporting(): boolean {
    return this.ensureRendered().isImporting;
  }

  getImportError(): string | null {
    return this.ensureRendered().importError;
  }

  getImportSuccess(): string | null {
    return this.ensureRendered().importSuccess;
  }

  /**
   * handleFileSelect を呼び出す
   * @param file 選択ファイル（省略時はダミーの .json File）
   */
  async callHandleFileSelect(file?: File): Promise<void> {
    const result = this.ensureRendered();
    const targetFile =
      file ?? new File(['{"version":"1.0","rules":[]}'], 'rules.json', { type: 'application/json' });
    await act(async () => {
      await result.handleFileSelect(targetFile);
      await flushPromises();
    });
  }

  /**
   * handleFileSelect を開始するが、importRulesJson の完了を待たない
   * インポート中（isImporting=true）の状態を観測するために使用
   */
  async startHandleFileSelectWithoutAwaiting(file?: File): Promise<void> {
    const result = this.ensureRendered();
    const targetFile =
      file ?? new File(['{"version":"1.0","rules":[]}'], 'rules.json', { type: 'application/json' });
    await act(async () => {
      void result.handleFileSelect(targetFile);
      await flushPromises();
    });
  }

  async callDismissImportError(): Promise<void> {
    const result = this.ensureRendered();
    await act(async () => {
      result.dismissImportError();
      await flushPromises();
    });
  }

  async callDismissImportSuccess(): Promise<void> {
    const result = this.ensureRendered();
    await act(async () => {
      result.dismissImportSuccess();
      await flushPromises();
    });
  }
}
