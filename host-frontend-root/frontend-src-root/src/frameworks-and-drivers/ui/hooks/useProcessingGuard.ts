import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useProcessingGuardの戻り値の型
 */
export interface UseProcessingGuardResult {
  /** 処理中かどうか（視覚的フィードバック用） */
  isProcessing: boolean;
  /** ハンドラをガードでラップする関数 */
  guardedHandler: <T extends () => void>(handler: T) => () => void;
}

/**
 * 連続クリック防止のためのカスタムフック
 *
 * @param isActive - trueになったときに処理状態をリセット（例: ダイアログのisOpen）
 * @returns isProcessing状態とガード付きハンドラを生成する関数
 *
 * @example
 * ```tsx
 * const { isProcessing, guardedHandler } = useProcessingGuard(isOpen);
 * const handleConfirm = useMemo(() => guardedHandler(onConfirm), [guardedHandler, onConfirm]);
 * const handleCancel = useMemo(() => guardedHandler(onCancel), [guardedHandler, onCancel]);
 *
 * <button onClick={handleConfirm} disabled={isProcessing}>確認</button>
 * ```
 */
export const useProcessingGuard = (isActive: boolean): UseProcessingGuardResult => {
  // 視覚的フィードバック用の状態
  const [isProcessing, setIsProcessing] = useState(false);
  // 同期的なクリックガード用のref（即座に更新される）
  const isProcessingRef = useRef(false);

  // isActiveがtrueになったときに状態をリセット
  // （コンポーネントがアンマウントされずに再利用される場合の対策）
  useEffect(() => {
    if (isActive) {
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  }, [isActive]);

  // ハンドラをガードでラップする関数
  const guardedHandler = useCallback(
    <T extends () => void>(handler: T): (() => void) => {
      return () => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        setIsProcessing(true);
        handler();
      };
    },
    []
  );

  return { isProcessing, guardedHandler };
};
