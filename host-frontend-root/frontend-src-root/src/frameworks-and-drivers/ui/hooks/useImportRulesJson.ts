import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { container } from 'src/frameworks-and-drivers/di/container';
import { IImportRulesJsonControllerFactory } from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';

/**
 * useImportRulesJson フックの返却値型。
 * - handleFileSelect: ファイル選択時に呼ぶ。JSONを読み取り直接インポートを実行する。
 * - isImporting: インポート実行中は true。ImportButton を disabled にするために使用する。
 * - importError: エラー発生時のメッセージ文字列（null = エラーなし）。
 * - importSuccess: 成功時のメッセージ文字列（null = 未完了または消去済み）。
 * - dismissImportError: エラートーストを閉じる（importError を null に）。
 * - dismissImportSuccess: 成功トーストを閉じる（importSuccess を null に）。
 */
export interface UseImportRulesJsonResult {
  handleFileSelect: (file: File) => Promise<void>;
  isImporting: boolean;
  importError: string | null;
  importSuccess: string | null;
  dismissImportError: () => void;
  dismissImportSuccess: () => void;
}

/**
 * ルールJSONインポートに関するState管理とロジックを提供するカスタムフック
 * onRulesChanged: インポート成功後にルール一覧を再取得するコールバック
 */
export const useImportRulesJson = (onRulesChanged: () => void): UseImportRulesJsonResult => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // コールバック参照を安定化し、useMemoの再生成を防ぐ
  const onRulesChangedRef = useRef(onRulesChanged);
  useEffect(() => {
    onRulesChangedRef.current = onRulesChanged;
  }, [onRulesChanged]);

  const importController = useMemo(() => {
    const factory = container.resolve<IImportRulesJsonControllerFactory>('IImportRulesJsonControllerFactory');
    return factory.create(
      (formattedMessage: string) => {
        // onSuccess: 成功トースト表示 + ルール一覧リフレッシュ
        setIsImporting(false);
        setImportSuccess(formattedMessage);
        onRulesChangedRef.current();
      },
      (formattedMessage: string) => {
        // onError: エラートースト表示
        setIsImporting(false);
        setImportError(formattedMessage);
      }
    );
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;
    setImportError(null);
    setImportSuccess(null);
    setIsImporting(true);

    try {
      await importController.importRulesJson(file);
    } catch (err) {
      setIsImporting(false);
      setImportError(err instanceof Error ? err.message : 'インポート中に予期しないエラーが発生しました');
    }
  }, [importController]);

  const dismissImportError = useCallback(() => {
    setImportError(null);
  }, []);

  const dismissImportSuccess = useCallback(() => {
    setImportSuccess(null);
  }, []);

  return {
    handleFileSelect,
    isImporting,
    importError,
    importSuccess,
    dismissImportError,
    dismissImportSuccess,
  };
};
