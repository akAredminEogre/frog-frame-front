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
 * このフックは以下の使用パターンを前提としている:
 * - isActiveはモーダルダイアログの開閉状態を表す
 * - ガード対象のハンドラはダイアログを閉じる処理を含む
 * - 処理状態はダイアログ再オープン時（isActiveがtrueになったとき）にリセットされる
 * - ハンドラが同期的に完了する、またはダイアログを即座に閉じる
 *
 * 上記の前提が満たされない場合（例: バリデーションエラーでダイアログを開いたまま、
 * 非同期処理の完了を待つ必要がある等）、このフックは適切に機能しない。
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
        handler();
      };
    },
    []
  );

  return { isProcessing, guardedHandler };
};
