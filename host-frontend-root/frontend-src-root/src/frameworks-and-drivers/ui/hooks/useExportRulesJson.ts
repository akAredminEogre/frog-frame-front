import { useCallback, useMemo, useState } from 'react';

import { container } from 'src/frameworks-and-drivers/di/container';
import { IExportRulesJsonControllerFactory } from 'src/interface-adapters/factories/IExportRulesJsonControllerFactory';

export interface UseExportRulesJsonResult {
  exportRulesJson: () => Promise<void>;
  isExporting: boolean;
  exportError: string | null;
  dismissExportError: () => void;
}

/**
 * ルールJSONエクスポートに関するState管理とロジックを提供するカスタムフック
 * onSuccessコールバック内でBlob生成→ダウンロード実行を行う
 */
export const useExportRulesJson = (): UseExportRulesJsonResult => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportController = useMemo(() => {
    const factory = container.resolve<IExportRulesJsonControllerFactory>('IExportRulesJsonControllerFactory');
    return factory.create(
      (jsonContent: string, fileName: string) => {
        // onSuccess: Blob生成→ダウンロード実行
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      (formattedMessage: string) => {
        setExportError(formattedMessage);
      }
    );
  }, []);

  const exportRulesJson = useCallback(async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      await exportController.exportRulesJson();
    } catch {
      // Interactor内で全例外をcatchしpresentError経由でonErrorコールバックに通知する設計。
      // catch節は予期しないエラーに対する防御的プログラミングとして、未処理のPromise拒否を防ぐ。
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, exportController]);

  const dismissExportError = useCallback(() => {
    setExportError(null);
  }, []);

  return {
    exportRulesJson,
    isExporting,
    exportError,
    dismissExportError,
  };
};
