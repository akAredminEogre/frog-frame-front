import React from 'react';

import { ExportButton } from 'src/frameworks-and-drivers/ui/components/atoms/ExportButton/ExportButton';
import { ToastNotification } from 'src/frameworks-and-drivers/ui/components/atoms/ToastNotification';

export interface ExportRulesJsonUIProps {
  onExport: () => void;
  isExporting: boolean;
  exportError: string | null;
  onDismissError: () => void;
}

/**
 * ルールJSONエクスポートに関するUI（エクスポートボタンとエラーToast通知）を統合するコンポーネント
 */
export const ExportRulesJsonUI: React.FC<ExportRulesJsonUIProps> = ({
  onExport,
  isExporting,
  exportError,
  onDismissError,
}) => {
  return (
    <>
      <div className="export-button-container">
        <ExportButton
          onClick={onExport}
          disabled={isExporting}
        />
      </div>

      <ToastNotification
        message={exportError ?? ''}
        type="error"
        isVisible={exportError !== null}
        onClose={onDismissError}
      />
    </>
  );
};
