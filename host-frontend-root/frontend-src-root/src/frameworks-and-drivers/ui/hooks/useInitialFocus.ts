import { RefObject, useEffect, useRef } from 'react';

/**
 * 初期フォーカス設定のためのカスタムフック
 *
 * isActiveがtrueになったときに、返されたrefの要素にフォーカスを設定する。
 * FocusScopeのautoFocusを使わず手動で設定（テスト環境との互換性のため）。
 * ADR-007「2. フォーカス管理」に準拠。
 *
 * @param isActive - trueになったときにフォーカスを設定（例: ダイアログのisOpen）
 * @returns フォーカス対象要素のref
 *
 * @example
 * ```tsx
 * const focusRef = useInitialFocus<HTMLButtonElement>(isOpen);
 *
 * <button ref={focusRef}>キャンセル</button>
 * ```
 */
export const useInitialFocus = <T extends HTMLElement>(
  isActive: boolean
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.focus();
    }
  }, [isActive]);

  return ref;
};
