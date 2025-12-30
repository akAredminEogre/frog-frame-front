import { useId } from 'react';

/**
 * useDialogIdsの戻り値の型
 */
export interface UseDialogIdsResult {
  /** タイトル要素のID（aria-labelledby用） */
  titleId: string;
  /** 説明要素のID（aria-describedby用） */
  descriptionId: string;
}

/**
 * ダイアログのARIA用ID生成カスタムフック
 *
 * useId()を使用して一意のIDを生成し、複数ダイアログの同時レンダリングに対応。
 * ADR-007「1.1 ID生成にuseId()を使用（必須）」に準拠。
 *
 * @param prefix - IDの接頭辞（デバッグ時の可読性向上）
 * @returns titleIdとdescriptionId
 *
 * @example
 * ```tsx
 * const { titleId, descriptionId } = useDialogIds('confirm-dialog');
 *
 * <div role="dialog" aria-labelledby={titleId} aria-describedby={descriptionId}>
 *   <h2 id={titleId}>タイトル</h2>
 *   <p id={descriptionId}>説明文</p>
 * </div>
 * ```
 */
export const useDialogIds = (prefix: string): UseDialogIdsResult => {
  const uniqueId = useId();
  const titleId = `${prefix}-title-${uniqueId}`;
  const descriptionId = `${prefix}-description-${uniqueId}`;

  return { titleId, descriptionId };
};
