import React from 'react';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import styles from 'src/components/organisms/RulesTable/RulesTable.module.css';

interface RulesTableProps {
  rules: RewriteRule[];
  onEdit: (ruleId: string | number) => void;
}

const RulesTable: React.FC<RulesTableProps> = ({ rules, onEdit }) => {
  return (
    <div className={styles.rulesTableContainer}>
      <table className={styles.rulesTable}>
        <thead>
          <tr>
            <th>URLパターン</th>
            <th>置換前</th>
            <th>置換後</th>
            <th>正規表現</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} className={styles.ruleRow}>
              <td className={styles.ruleUrlPattern} title={rule.urlPattern || ''}>
                {rule.urlPattern 
                  ? (rule.urlPattern.length > 40 
                     ? rule.urlPattern.substring(0, 40) + '...'
                     : rule.urlPattern)
                  : '-'}
              </td>
              <td className={styles.ruleOldString} title={rule.oldString}>
                {rule.oldString}
              </td>
              <td className={styles.ruleNewString} title={rule.newString}>
                {rule.newString}
              </td>
              <td className={styles.ruleRegex}>
                {rule.isRegex ? (
                  <span className={styles.regexBadge}>✓</span>
                ) : (
                  <span className={styles.noRegex}>-</span>
                )}
              </td>
              <td className={styles.ruleActions}>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit(rule.id)}
                  type="button"
                >
                  編集
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RulesTable;