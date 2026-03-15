import React from 'react';

import { ImportButton } from 'src/frameworks-and-drivers/ui/components/atoms/ImportButton/ImportButton';
import { ToastNotification } from 'src/frameworks-and-drivers/ui/components/atoms/ToastNotification';

export interface ImportRulesJsonUIProps {
  onImportClick: (file: File) => void;
  isImporting: boolean;
  importError: string | null;
  importSuccess: string | null;
  onDismissError: () => void;
  onDismissSuccess: () => void;
}

/**
 * ルールJSONインポートに関するUI（インポートボタン・トースト通知）を統合するOrganism
 */
export const ImportRulesJsonUI: React.FC<ImportRulesJsonUIProps> = ({
  onImportClick,
  isImporting,
  importError,
  importSuccess,
  onDismissError,
  onDismissSuccess,
}) => {
  return (
    <>
      <div className="import-button-container">
        <ImportButton
          onFileSelect={onImportClick}
          disabled={isImporting}
        />
      </div>

      <ToastNotification
        message={importError ?? ''}
        type="error"
        isVisible={importError !== null}
        onClose={onDismissError}
      />

      <ToastNotification
        message={importSuccess ?? ''}
        type="success"
        isVisible={importSuccess !== null}
        onClose={onDismissSuccess}
      />
    </>
  );
};
