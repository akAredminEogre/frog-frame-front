import React, { useRef } from 'react';

import styles from 'src/frameworks-and-drivers/ui/components/atoms/ImportButton/ImportButton.module.css';
import { UploadIcon } from 'src/frameworks-and-drivers/ui/components/atoms/ImportButton/UploadIcon';

/**
 * ImportButtonコンポーネントのProps
 */
export interface ImportButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

/**
 * ルールインポート用のアップロードアイコン付きボタン
 * hidden <input type="file"> を内包し、ボタンクリックでファイル選択ダイアログを発火する
 * disabled時(インポート中)はグレーアウト
 */
export const ImportButton: React.FC<ImportButtonProps> = ({
  onFileSelect,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // 同じファイルを再選択できるようにリセット
    event.target.value = '';
  };

  return (
    <>
      <button
        type="button"
        className={styles.importButton}
        onClick={handleButtonClick}
        disabled={disabled}
        aria-label="ルールをJSONインポート"
        title="JSONファイルからルールをインポート"
        data-testid="import-button"
      >
        <UploadIcon className={styles.icon} />
        インポート
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        data-testid="import-file-input"
      />
    </>
  );
};
