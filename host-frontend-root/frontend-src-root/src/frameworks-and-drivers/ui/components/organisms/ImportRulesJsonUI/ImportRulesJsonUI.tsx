import React from 'react';

import { ImportButton } from 'src/frameworks-and-drivers/ui/components/atoms/ImportButton/ImportButton';
import { ToastNotification } from 'src/frameworks-and-drivers/ui/components/atoms/ToastNotification';

export interface ImportRulesJsonUIProps {
  onImportClick: (file: File) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isImporting: boolean;
  previewData: { currentCount: number; importCount: number } | null;
  importError: string | null;
  importSuccess: string | null;
  onDismissError: () => void;
  onDismissSuccess: () => void;
}

/**
 * ルールJSONインポートに関するUI（インポートボタン・確認ダイアログ・トースト通知）を統合するOrganism
 */
export const ImportRulesJsonUI: React.FC<ImportRulesJsonUIProps> = ({
  onImportClick,
  onConfirm,
  onCancel,
  isImporting,
  previewData,
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

      {previewData !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-preview-title"
          data-testid="import-preview-dialog"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
            }}
          >
            <h2 id="import-preview-title" style={{ marginTop: 0 }}>インポートの確認</h2>
            <p>
              現在{previewData.currentCount}件のルールがすべて削除され、
              ファイル内の{previewData.importCount}件のルールに置換されます。
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onCancel}
                disabled={isImporting}
                data-testid="import-cancel-button"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isImporting}
                data-testid="import-confirm-button"
              >
                インポート実行
              </button>
            </div>
          </div>
        </div>
      )}

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
