import React from 'react';

import { DownloadIcon } from 'src/frameworks-and-drivers/ui/components/atoms/ExportButton/DownloadIcon';
import styles from 'src/frameworks-and-drivers/ui/components/atoms/ExportButton/ExportButton.module.css';

/**
 * ExportButtonコンポーネントのProps
 */
export interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/**
 * ルールエクスポート用のダウンロードアイコン付きボタン
 * disabled時(ルール0件 or エクスポート中)はグレーアウト
 */
export const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={styles.exportButton}
      onClick={onClick}
      disabled={disabled}
      aria-label="ルールをJSONエクスポート"
      title="ルールをJSONファイルとしてエクスポート"
      data-testid="export-button"
    >
      <DownloadIcon className={styles.icon} />
      エクスポート
    </button>
  );
};
