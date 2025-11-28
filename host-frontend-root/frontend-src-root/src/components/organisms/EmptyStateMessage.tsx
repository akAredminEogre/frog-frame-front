import React from 'react';

export const EmptyStateMessage: React.FC = () => {
  return (
    <div className="empty-state">
      <p>保存されたルールがありません。</p>
      <p>拡張機能のポップアップからルールを作成してください。</p>
    </div>
  );
};