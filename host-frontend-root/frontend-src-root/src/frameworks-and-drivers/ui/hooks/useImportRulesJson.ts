import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { container } from 'src/frameworks-and-drivers/di/container';
import { IImportRulesJsonControllerFactory } from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';

/**
 * インポートプレビューの件数情報を保持する状態型。
 * currentCount: 現在の既存ルール件数、importCount: インポートするルール件数。
 */
export interface ImportPreviewState {
  currentCount: number;
  importCount: number;
}

/**
 * useImportRulesJson フックの返却値型。
 * - handleFileSelect: ファイル選択時に呼ぶ。JSONを読み取り Phase 1（検証・プレビュー）を実行する。
 * - confirmImport: プレビューダイアログの「インポート実行」で呼ぶ。Phase 2（一括上書き）を非同期で実行する。
 * - cancelImport: プレビューダイアログを閉じる。既存ルールは変更しない（同期）。
 * - isImporting: Phase 2 実行中は true。ImportButton を disabled にするために使用する。
 * - previewData: Phase 1 完了後に設定される件数情報。null のときはダイアログを非表示。
 * - importError: エラー発生時のメッセージ文字列（null = エラーなし）。
 * - importSuccess: 成功時のメッセージ文字列（null = 未完了または消去済み）。
 * - dismissImportError: エラートーストを閉じる（importError を null に）。
 * - dismissImportSuccess: 成功トーストを閉じる（importSuccess を null に）。
 */
export interface UseImportRulesJsonResult {
  handleFileSelect: (file: File) => Promise<void>;
  confirmImport: () => Promise<void>;
  cancelImport: () => void;
  isImporting: boolean;
  previewData: ImportPreviewState | null;
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
  const [previewData, setPreviewData] = useState<ImportPreviewState | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // コールバック参照を安定化し、useMemoの再生成を防ぐ
  const onRulesChangedRef = useRef(onRulesChanged);
  useEffect(() => {
    onRulesChangedRef.current = onRulesChanged;
  }, [onRulesChanged]);

  const { previewController, confirmController } = useMemo(() => {
    const factory = container.resolve<IImportRulesJsonControllerFactory>('IImportRulesJsonControllerFactory');
    return factory.create(
      (currentCount: number, importCount: number) => {
        // onPreview: プレビューダイアログを表示（pendingRulesはfactory内のconfirmInteractorが保持）
        setPreviewData({ currentCount, importCount });
      },
      (formattedMessage: string) => {
        // onSuccess: 成功トースト表示 + ルール一覧リフレッシュ
        setPreviewData(null);
        setIsImporting(false);
        setImportSuccess(formattedMessage);
        onRulesChangedRef.current();
      },
      (formattedMessage: string) => {
        // onError: エラートースト表示
        setPreviewData(null);
        setIsImporting(false);
        setImportError(formattedMessage);
      }
    );
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;
    setImportError(null);
    setImportSuccess(null);

    try {
      await previewController.previewRulesJson(file);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'ファイルの読み取りに失敗しました');
    }
  }, [previewController]);

  const confirmImport = useCallback(async () => {
    if (isImporting || !previewData) return;
    setIsImporting(true);

    try {
      await confirmController.confirmImport();
    } catch (err) {
      // Interactor内で全例外をcatchしpresentError経由でonErrorコールバックに通知する設計。
      // catch節は予期しないエラーに対する防御的プログラミングとして、未処理のPromise拒否を防ぐ。
      setImportError(err instanceof Error ? err.message : 'インポートの確定中に予期しないエラーが発生しました');
    } finally {
      setIsImporting(false);
    }
  }, [isImporting, previewData, confirmController]);

  const cancelImport = useCallback(() => {
    setPreviewData(null);
  }, []);

  const dismissImportError = useCallback(() => {
    setImportError(null);
  }, []);

  const dismissImportSuccess = useCallback(() => {
    setImportSuccess(null);
  }, []);

  return {
    handleFileSelect,
    confirmImport,
    cancelImport,
    isImporting,
    previewData,
    importError,
    importSuccess,
    dismissImportError,
    dismissImportSuccess,
  };
};
