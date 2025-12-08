import React from 'react';

import styles from 'src/components/organisms/EmptyStateMessage/EmptyStateMessage.module.css';

const EmptyStateMessage: React.FC = () => {
  return (
    <div className={styles.emptyState} data-testid="empty-state">
      <p>保存されたルールがありません。</p>
      <p>拡張機能のポップアップからルールを作成してください。</p>
    </div>
  );
};

export default EmptyStateMessage;