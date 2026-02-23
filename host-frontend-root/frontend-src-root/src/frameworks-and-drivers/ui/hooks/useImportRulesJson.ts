import { useCallback, useMemo, useState } from 'react';

import { container } from 'src/frameworks-and-drivers/di/container';
import { IImportRulesJsonControllerFactory } from 'src/interface-adapters/factories/IImportRulesJsonControllerFactory';

export interface ImportPreviewState {
  currentCount: number;
  importCount: number;
}

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

  const importController = useMemo(() => {
    const factory = container.resolve<IImportRulesJsonControllerFactory>('IImportRulesJsonControllerFactory');
    return factory.create(
      (currentCount: number, importCount: number) => {
        // onPreview: プレビューダイアログを表示
        setPreviewData({ currentCount, importCount });
      },
      (formattedMessage: string) => {
        // onSuccess: 成功トースト表示 + ルール一覧リフレッシュ
        setPreviewData(null);
        setIsImporting(false);
        setImportSuccess(formattedMessage);
        onRulesChanged();
      },
      (formattedMessage: string) => {
        // onError: エラートースト表示
        setPreviewData(null);
        setIsImporting(false);
        setImportError(formattedMessage);
      }
    );
  }, [onRulesChanged]);

  const handleFileSelect = useCallback(async (file: File) => {
    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    const jsonString = await new Promise<string>((resolve, reject) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('ファイルの読み取りに失敗しました'));
      reader.readAsText(file);
    });

    await importController.importRulesJson(jsonString);
  }, [importController]);

  const confirmImport = useCallback(async () => {
    if (isImporting) {
      return;
    }
    setIsImporting(true);

    try {
      await importController.confirmImport();
    } catch {
      // Interactor内で全例外をcatchしpresentError経由でonErrorコールバックに通知する設計。
      // catch節は予期しないエラーに対する防御的プログラミングとして、未処理のPromise拒否を防ぐ。
    }
  }, [isImporting, importController]);

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
