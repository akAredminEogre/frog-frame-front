import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useProcessingGuardの戻り値の型
 */
export interface UseProcessingGuardResult {
  /** 処理中かどうか（視覚的フィードバック用） */
  isProcessing: boolean;
  /**
   * ハンドラをガードでラップする関数
   *
   * 注意: 同期ハンドラのみサポート。非同期ハンドラ（async関数）を渡した場合、
   * Promiseの完了を待たずに処理完了と見なされる。
   */
  guardedHandler: <T extends () => void>(handler: T) => () => void;
}

/**
 * 連続クリック防止のためのカスタムフック
 *
 * @remarks
 * 処理状態は以下のタイミングでリセットされる:
 * - ハンドラ内でエラーが発生した場合（エラーは再スローされる）
 * - isActiveがtrueになったとき（ダイアログ再オープン時）
 *
 * 正常完了時は状態をリセットしない（連続クリック防止のため）。
 * ダイアログを閉じる処理がハンドラに含まれることを前提とし、
 * ダイアログ再オープン時にisActiveがtrueになることで状態がリセットされる。
 *
 * 制約: 同期ハンドラのみサポート。非同期ハンドラを渡した場合、
 * Promiseの完了を待たずに処理完了と見なされる。
 *
 * @param isActive - trueになったときに処理状態をリセット（例: ダイアログのisOpen）
 * @returns isProcessing状態とガード付きハンドラを生成する関数
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
        try {
          handler();
          // 正常完了時は状態をリセットしない（連続クリック防止のため）
          // ダイアログ再オープン時（isActive=true）にリセットされる
        } catch (error) {
          // エラー時は状態をリセットして再試行可能にする
          isProcessingRef.current = false;
          setIsProcessing(false);
          throw error;
        }
      };
    },
    []
  );

  return { isProcessing, guardedHandler };
};
